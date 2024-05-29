using AuthenticationServer.API.Models;

namespace AuthenticationServer.API.Services.TokenGenerators
{
    public class RefreshTokenGenerator
    {
        private readonly TokenGenerator _tokenGenerator;
        private readonly AuthenticationConfiguration _configuration;

        public RefreshTokenGenerator(AuthenticationConfiguration configuration, TokenGenerator tokenGenerator)
        {
            _configuration = configuration;
            _tokenGenerator = tokenGenerator;

        }

        public string GenerateToken()
        {

            return _tokenGenerator.GenerateToken(
                _configuration.RefreshTokenSecret,
                _configuration.Issuer,
                _configuration.Audience,
                _configuration.RefreshTokenExpirationMinutes
             );
        }
    }
}
