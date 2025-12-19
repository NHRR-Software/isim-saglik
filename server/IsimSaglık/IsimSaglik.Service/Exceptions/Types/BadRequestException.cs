namespace IsimSaglik.Service.Exceptions.Types
{
    public class BadRequestException : Exception
    {
        public string Code { get; }

        public BadRequestException(string message, string code) : base(message)
        {
            Code = code;
        }
    }
}