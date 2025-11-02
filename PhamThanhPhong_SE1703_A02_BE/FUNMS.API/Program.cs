
using System.Text;
using FUNMS.API.Services;
using FUNMS.BLL;
using FUNMS.BLL.Dtos;
using FUNMS.BLL.Dtos.ResponseDtos;
using FUNMS.BLL.Services;
using FUNMS.DAL;
using FUNMS.DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.ModelBuilder;
using Microsoft.OpenApi.Models;

namespace FUNMS.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var edmBuilder = new ODataConventionModelBuilder();
            edmBuilder.EntitySet<AccountWithPassResDto>("SystemAccounts");
            edmBuilder.EntitySet<NewsArticleDto>("NewsArticles");
            edmBuilder.EntitySet<NewsArticlePublicDto>("PublicNewsArticles");
            edmBuilder.EntitySet<CategoryDto>("Categories");
            edmBuilder.EntitySet<TagDto>("Tags");

            // Add services to the container.

            builder.Services.AddControllers()
                .AddOData(options => options
                    .Select()
                    .Filter()
                    .Count()
                    .OrderBy()
                    .Expand()
                    .SetMaxTop(100)
                    .AddRouteComponents("odata", edmBuilder.GetEdmModel())
                )
                .ConfigureApiBehaviorOptions(options => {
                    options.InvalidModelStateResponseFactory = context => {
                        var errors = context.ModelState.Values
                            .SelectMany(v => v.Errors)
                            .Select(e => string.IsNullOrWhiteSpace(e.ErrorMessage) ? e.Exception?.Message : e.ErrorMessage)
                            .ToList();

                        var response = new ApiResponse<object?>(
                            400,
                            string.Join("; ", errors),
                            default
                            );

                        return new BadRequestObjectResult(response);
                    };
                });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "PetShopAPI", Version = "v1" });

                // Add Security Definition
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
                    Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer"
                });

                // Add Security Requirement
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                    };

                    options.Events = new JwtBearerEvents {
                        OnChallenge = async context => {
                            context.HandleResponse();
                            if (context.Response.HasStarted) return;

                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Response.ContentType = "application/json";
                           
                            var response = new ApiResponse<object?>(
                                401,
                                "Unauthorized: Access token is missing or invalid.",
                                default
                                );

                            await context.Response.WriteAsJsonAsync(response);
                        },
                        OnForbidden = async context => {
                            if (context.Response.HasStarted) return;

                            context.Response.StatusCode = StatusCodes.Status403Forbidden;
                            context.Response.ContentType = "application/json";
                            
                            var response = new ApiResponse<object?>(
                                403,
                                "Forbidden: You do not have permission to access this resource.",
                                default
                                );

                            await context.Response.WriteAsJsonAsync(response);
                        }
                    };
                });

            builder.Services.AddAuthorization();
            builder.Services.AddSingleton<JwtService>();

            builder.Services.AddScoped<AccountRepository>();
            builder.Services.AddScoped<AccountService>();
            builder.Services.AddScoped<NewsRepository>();
            builder.Services.AddScoped<NewsService>();
            builder.Services.AddScoped<CategoryRepository>();
            builder.Services.AddScoped<CategoryService>();
            builder.Services.AddScoped<TagRepository>();
            builder.Services.AddScoped<TagService>();

            builder.Services.AddDbContext<FunewsManagementContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("FUNewsManagement")));
            builder.Services.AddScoped(typeof(FunewsManagementContext));
            

            builder.Services.AddAutoMapper(cfg => cfg.AddMaps(typeof(AutoMapperConfig).Assembly));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowAll");
            app.UseHttpsRedirection();

            app.UseExceptionHandler(errorApp => {
                errorApp.Run(async context => {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    context.Response.ContentType = "application/json";
                    
                    var response = new ApiResponse<object?>(
                        500,
                        "An unexpected error occurred.",
                        default
                        );

                    await context.Response.WriteAsJsonAsync(response);
                });
            });

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
