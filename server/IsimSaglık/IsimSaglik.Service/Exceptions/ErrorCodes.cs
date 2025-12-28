namespace IsimSaglik.Service.Exceptions
{
    public class ErrorCodes
    {
        // AUTHENTICATION & USER 
        public const string UserNotFound = "AUTH-001";
        public const string UserAlreadyExists = "AUTH-002";
        public const string InvalidCredentials = "AUTH-003";
        public const string AccountInactive = "AUTH-004";
        public const string InvalidOperation = "AUTH-005";
        public const string TokenNotFound = "AUTH-006";
        public const string InvalidRefreshToken = "AUTH-007";
        public const string AuthProviderError = "AUTH-008";
        public const string InvalidToken = "AUTH-009";


        // INVITATION
        public const string InvitationNotFound = "INV-001";
        public const string InvitationExpired = "INV-002";
        public const string InvitationAlreadyUsed = "INV-003";
        public const string InvitationAlreadyActive = "INV-004";
        public const string EmailSendingFailed = "INV-005";


        // VALIDATION
        public const string ValidationError = "VAL-001";


        // SYSTEM
        public const string UnexpectedError = "SYS-001";
        public const string DatabaseError = "SYS-002";
    }
}