using IsimSaglik.Entity.DTOs.Common;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
using System.Net;
using System.Text.Json;

namespace IsimSaglik.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _env;
        private readonly RequestDelegate _next;


        public GlobalExceptionMiddleware(
            ILogger<GlobalExceptionMiddleware> logger,
            IWebHostEnvironment env,    
            RequestDelegate next)
        {
            _logger = logger;
            _env = env;
            _next = next;
        }


        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception has occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }


        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            int statusCode;
            ApiErrorDto apiError;

            switch (exception)
            {
                case NotFoundException ex:
                    statusCode = (int)HttpStatusCode.NotFound;
                    apiError = new ApiErrorDto(ex.Code, ex.Message);
                    break;

                case BadRequestException ex:
                    statusCode = (int)HttpStatusCode.BadRequest;
                    apiError = new ApiErrorDto(ex.Code, ex.Message);
                    break;

                case UnauthorizedException ex:
                    statusCode = (int)HttpStatusCode.Unauthorized;
                    apiError = new ApiErrorDto(ex.Code, ex.Message);
                    break;

                case ForbiddenException ex:
                    statusCode = (int)HttpStatusCode.Forbidden;
                    apiError = new ApiErrorDto(ex.Code, ex.Message);
                    break;

                default:
                    statusCode = (int)HttpStatusCode.InternalServerError;
                    List<string>? details = _env.IsDevelopment()
                        ? [exception.ToString()]
                        : null;
                    apiError = new ApiErrorDto(ErrorCodes.UnexpectedError, "An unexpected error occurred.", details);
                    break;
            }

            context.Response.StatusCode = statusCode;

            var response = ApiResponseDto<object>.Fail(statusCode, apiError);
            var json = JsonSerializer.Serialize(response);

            return context.Response.WriteAsync(json);
        }
    }
}
