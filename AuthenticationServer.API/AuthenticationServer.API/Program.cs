using AuthenticationServer.API.Models;
using AuthenticationServer.API.Services.Authenticators;
using AuthenticationServer.API.Services.PasswordHashers;
using AuthenticationServer.API.Services.RefreshTokenRepository;
using AuthenticationServer.API.Services.TokenGenerators;
using AuthenticationServer.API.Services.TokenValidators;
using AuthenticationServer.API.Services.UserRepositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AuthenticationServer.API
{
    public class Program
    {

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();

            var  authenticationConfiguration= builder.Configuration.GetSection("Authentication").Get<AuthenticationConfiguration>();
            builder.Services.AddSingleton(authenticationConfiguration);


            builder.Services.AddCors(options => {
                options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().WithHeaders(["Content-Type", "Authorization"]).AllowAnyMethod());
            });

            string connectionString = builder.Configuration.GetConnectionString("sqlserver");
            builder.Services.AddDbContext<AuthenticationDbContext>(o => o.UseSqlServer(connectionString));
            builder.Services.AddSingleton<AccessTokenGenerator>();
            builder.Services.AddSingleton<RefreshTokenValidator>();
            builder.Services.AddSingleton<RefreshTokenGenerator>();
            builder.Services.AddScoped<Authenticator>();
            builder.Services.AddSingleton<TokenGenerator>();
            builder.Services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
            builder.Services.AddScoped<IUserRepository, DatabaseUserRepository>();
            builder.Services.AddScoped<IRefreshTokenRepository, DatabaseRefreshTokenRepository>();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationConfiguration.AccessTokenSecret)),
                    ValidIssuer = authenticationConfiguration.Issuer,
                    ValidAudience = authenticationConfiguration.Audience,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors("AllowAll");


            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
