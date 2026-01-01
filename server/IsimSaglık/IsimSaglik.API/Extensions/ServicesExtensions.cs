using IsimSaglik.Entity.DTOs.Common;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Infrastructure.Concrete;
using IsimSaglik.Infrastructure.Settings;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Repository.Concrete;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Concrete;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace IsimSaglik.API.Extensions
{
    public static class ServicesExtensions
    {
        public static void ConfigureSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
            services.Configure<SupabaseSettings>(configuration.GetSection("SupabaseSettings"));
        }


        public static void ConfigureSupabase(this IServiceCollection services)
        {
            services.AddScoped<ISupabaseClient>(provider =>
            {
                var settings = provider.GetRequiredService<IOptions<SupabaseSettings>>();
                var service = new SupabaseClient(settings);

                service.InitializeAsync().Wait();
                return service;
            });
        }


        public static void ConfigureRepositoryManager(this IServiceCollection services) =>
            services.AddScoped<IRepositoryManager, RepositoryManager>();


        public static void ConfigureServiceManager(this IServiceCollection services) =>
            services.AddScoped<IServiceManager, ServiceManager>();


        public static void RegisterRepositories(this IServiceCollection services)
        {
            services.AddScoped<IHealthProfileRepository, HealthProfileRepository>();
            services.AddScoped<ISafetyFindingRepository, SafetyFindingRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IAssignmentRepository, AssignmentRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserInvitationRepository, UserInvitationRepository>();
        }


        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<IHealthProfileService, HealthProfileService>();
            services.AddScoped<IAssignmentService, AssignmentService>();
            services.AddScoped<ISafetyFindingService, SafetyFindingService>();
        }


        public static void RegisterInfrastructures(this IServiceCollection services)
        {
            services.AddScoped<ITokenGenerator, TokenGenerator>();
        }


        public static void ConfigureJWT(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>()
                ?? throw new ArgumentNullException(nameof(JwtSettings), "JwtSettings section not found in appsettings.json!");

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret))
                };
            });
        }


        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(s =>
            {
                s.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    In = ParameterLocation.Header,
                    Description = "Place to add JWT with Bearer",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                s.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Name = "Bearer"
                        },
                        new List<string>()
                    }
                });
            });
        }


        public static void ConfigureCustomValidationResponse(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState
                        .Where(e => e.Value is not null && e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value!.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToList();

                    var errorDto = new ApiErrorDto(
                        "VAL-001",
                        "Validation failed",
                        errors
                    );

                    var response = ApiResponseDto<object>.Fail(400, errorDto);

                    return new BadRequestObjectResult(response);
                };
            });
        }


        public static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           //.AllowCredentials()
                           .WithExposedHeaders("X-Pagination")
                );
            });
        }
    }
}