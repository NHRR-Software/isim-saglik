using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Service.Utilities
{
    public static class AvatarResolver
    {
        private const string CompanyUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/defaults/company.png";
        private const string MaleUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/defaults/male.png";
        private const string FemaleUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/defaults/female.png";
        private const string MaleExpertUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/defaults/male-expert.png";
        private const string FemaleExpertUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/defaults/female-expert.png";
        private const string DefaultUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/defaults/default.png";

        public static Uri GetDefaultUri(UserRole role, Gender gender)
        {
            string url = role switch
            {
                UserRole.Company => CompanyUrl,
                UserRole.Expert when gender == Gender.Male => MaleExpertUrl,
                UserRole.Expert when gender == Gender.Female => FemaleExpertUrl,
                _ => gender switch
                {
                    Gender.Male => MaleUrl,
                    Gender.Female => FemaleUrl,
                    _ => DefaultUrl
                }
            };

            return new Uri(url);
        }
    }
}