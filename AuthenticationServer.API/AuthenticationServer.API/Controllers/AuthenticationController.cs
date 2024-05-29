using AuthenticationServer.API.Models;
using AuthenticationServer.API.Models.Requests;
using AuthenticationServer.API.Models.Responses;
using AuthenticationServer.API.Services.Authenticators;
using AuthenticationServer.API.Services.PasswordHashers;
using AuthenticationServer.API.Services.RefreshTokenRepository;
using AuthenticationServer.API.Services.TokenGenerators;
using AuthenticationServer.API.Services.TokenValidators;
using AuthenticationServer.API.Services.UserRepositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthenticationServer.API.Controllers
{
    public class AuthenticationController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly Authenticator _authenticator;
        private readonly RefreshTokenValidator _refreshTokenValidator;

        public AuthenticationController(IUserRepository userRepository, IPasswordHasher passwordHasher, Authenticator authenticator, RefreshTokenValidator refreshTokenValidator, IRefreshTokenRepository refreshTokenRepository)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _authenticator = authenticator;
            _refreshTokenValidator = refreshTokenValidator;
            _refreshTokenRepository = refreshTokenRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {

            if (!ModelState.IsValid)
            {
                return BadRequestModelState();
            }
            if (registerRequest.Password != registerRequest.ConfirmPassword)
            {
                return BadRequest(new ErrorResponse("passwords do not match"));
            }


            User existingUserByUserName = await _userRepository.GetByUserName(registerRequest.Username);
            if (existingUserByUserName != null)
            {
                return Conflict(new ErrorResponse("Username already exists"));
            }

            string passwordHash = _passwordHasher.HashPassword(registerRequest.Password);
            User registrationUser = new User()
            {
                Username = registerRequest.Username,
                PasswordHash = passwordHash

            };

            await _userRepository.Create(registrationUser);
            return Ok();
        }
        [HttpGet("getallusers")]
        public async Task<IActionResult> getallusers()
        {
            List<User> allUsers = await _userRepository.GetAll();
            return Ok(allUsers);
        }

        private IActionResult BadRequestModelState()
        {
            IEnumerable<string> errorMessages = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
            return BadRequest(new ErrorResponse(errorMessages));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequestModelState();
            }
            User user = await _userRepository.GetByUserName(loginRequest.Username);
            if(user == null)
            {
                return Unauthorized();
            }

            bool isCorrectPassword = _passwordHasher.VerifyPassword(loginRequest.Password, user.PasswordHash);
            if(!isCorrectPassword)
            {
                return Unauthorized();
            }

            AuthenticatedUserResponse response = await _authenticator.Authenticate(user);
            return Ok(response);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest refreshRequest )
        {
            if (!ModelState.IsValid)
            {
                return BadRequestModelState();
            }   

            bool isValidRefreshToken = _refreshTokenValidator.Validate(refreshRequest.RefreshToken);
            if (!isValidRefreshToken)
            {
                return BadRequest(new ErrorResponse("invalid Refresh token."));
            }

            RefreshToken refreshTokenDTO = await _refreshTokenRepository.GetByToken(refreshRequest.RefreshToken);

            if(refreshTokenDTO == null)
            {
                return NotFound(new ErrorResponse("invalid Refresh token."));

            }
            await _refreshTokenRepository.Delete(refreshTokenDTO.Id);

            User user = await _userRepository.GetByID(refreshTokenDTO.UserId);

            if(user == null)
            {
                return NotFound(new ErrorResponse("User not found"));
                
            }
            AuthenticatedUserResponse response = await _authenticator.Authenticate(user);
            return Ok(response);
        }

        [Authorize]
        [HttpDelete("logout")]
        public async Task<IActionResult> Logout()
        {
            string rawUserId = HttpContext.User.FindFirstValue("id");


            if(!Guid.TryParse(rawUserId,out Guid userId))
            {
                return Unauthorized();
            }

            await _refreshTokenRepository.DeleteAll(userId);

            return NoContent();

        }

        [Authorize]
        [HttpGet("Authenticate")]
        public async Task<IActionResult> Authenticate()
        {
            var identity = User.Identity as ClaimsIdentity;
            //var payload = User.Claims.Select(c => new { c.Type, c.Value });
            var payloady = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            return Ok(payloady.Value);
            //return Ok(payload);
        }
    }
}
