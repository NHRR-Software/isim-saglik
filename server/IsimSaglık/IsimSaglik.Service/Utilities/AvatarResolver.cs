using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Service.Utilities
{
    public static class AvatarResolver
    {
        private const string CompanyUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/images/profiles/company.webp";
        private const string MaleUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/images/profiles/male.webp";
        private const string FemaleUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/images/profiles/female.webp";
        private const string MaleExpertUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/images/profiles/male-expert.webp";
        private const string FemaleExpertUrl = "https://tvzbvqnfzadsunopzkts.supabase.co/storage/v1/object/public/images/profiles/female-expert.webp";


        public static Uri GetDefaultUri(UserRole role, Gender gender)
        {
            string url = role switch
            {
                UserRole.Company => CompanyUrl,

                UserRole.Expert when gender == Gender.Female => FemaleExpertUrl,
                UserRole.Expert => MaleExpertUrl,

                _ => gender switch
                {
                    Gender.Female => FemaleUrl,
                    _ => MaleUrl
                }
            };

            return new Uri(url);
        }
    }
}