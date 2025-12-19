namespace IsimSaglik.Entity.DTOs.Common
{
    public sealed record ApiErrorDto(
              string Code,
              string Message,
              List<string>? Details,
              DateTime Timestamp
          )
    {
        public ApiErrorDto(string code, string message) : this(code, message, null, DateTime.UtcNow)
        {
        }

        public ApiErrorDto(string code, string message, List<string> details) : this(code, message, details, DateTime.UtcNow)
        {
        }
    }
}