namespace IsimSaglik.Service.Exceptions.Types
{
    public class ForbiddenException : Exception
    {
        public string Code { get; }

        public ForbiddenException(string message, string code) : base(message)
        {
            Code = code;
        }
    }
}