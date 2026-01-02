using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;

namespace IsimSaglik.Service.Utilities
{
    internal static class FileValidator
    {
        public static byte[] ValidateAndConvertPhoto(string base64File)
        {
            if (base64File.Contains(','))
            {
                base64File = base64File[(base64File.IndexOf(',') + 1)..];
            }

            try
            {
                var photoBytes = Convert.FromBase64String(base64File);

                int maxFileSize = 5 * 1024 * 1024;

                if (photoBytes.Length > maxFileSize)
                {
                    throw new BadRequestException("Photo size must be maximum 5 MB.", ErrorCodes.ValidationError);
                }

                return photoBytes;
            }
            catch (FormatException)
            {
                throw new BadRequestException("Invalid Base64 format.", ErrorCodes.ValidationError);
            }
        }
    }
}