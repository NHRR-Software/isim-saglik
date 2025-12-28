namespace IsimSaglik.Entity.DTOs.Common
{
    public sealed record ApiResponseDto<T>(
        int Status,
        bool IsSuccess,
        T? Data,
        ApiErrorDto? Error,
        string? Message,
        DateTime Timestamp
    )
    {
        public static ApiResponseDto<T> Success(T data, int status = 200, string? message = null)
        {
            return new ApiResponseDto<T>(status, true, data, null, message, DateTime.UtcNow);
        }

        public static ApiResponseDto<object> SuccessNoContent(int status = 200, string? message = null)
        {
            return new ApiResponseDto<object>(status, true, null, null, message, DateTime.UtcNow);
        }

        public static ApiResponseDto<T> Fail(int status, ApiErrorDto error)
        {
            return new ApiResponseDto<T>(status, false, default, error, error?.Message, DateTime.UtcNow);
        }

        public static ApiResponseDto<T> Failure(string message, int status = 400)
        {
            return new ApiResponseDto<T>(status, false, default, null, message, DateTime.UtcNow);
        }
    }
}