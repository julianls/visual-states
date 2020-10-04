using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Linq;


namespace VisState.Shared
{
    public static class StaticWebAppsAuth
    {
        private class ClientPrincipal
        {
            public string IdentityProvider { get; set; }
            public string UserId { get; set; }
            public string UserDetails { get; set; }
            public IEnumerable<string> UserRoles { get; set; }
        }

        public static ClaimsPrincipal Parse(HttpRequest req)
        {
            var header = req.Headers["x-ms-client-principal"];
            if(header.Count == 0){
                bool isLocal = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID"));
                if(isLocal)
                {// fake user for local tests
                    var localIdentity = new ClaimsIdentity("LocalIdentity");
                    localIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, "0"));
                    localIdentity.AddClaim(new Claim(ClaimTypes.Name, "vslocaluser"));
                    localIdentity.AddClaim(new Claim(ClaimTypes.Role, "administrator"));
                    var userPrincipal = new ClaimsPrincipal(localIdentity);
                    req.HttpContext.User = userPrincipal;
                    return userPrincipal;
                }
                else
                    return null;
            }

            var data = header[0];
            var decoded = System.Convert.FromBase64String(data);
            var json = System.Text.ASCIIEncoding.ASCII.GetString(decoded);
            var principal = JsonSerializer.Deserialize<ClientPrincipal>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            principal.UserRoles = principal.UserRoles.Except(new string[] { "anonymous" }, StringComparer.CurrentCultureIgnoreCase);

            if (!principal.UserRoles.Any())
            {
                return new ClaimsPrincipal();
            }

            var identity = new ClaimsIdentity(principal.IdentityProvider);
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, principal.UserId));
            identity.AddClaim(new Claim(ClaimTypes.Name, principal.UserDetails));
            identity.AddClaims(principal.UserRoles.Select(r => new Claim(ClaimTypes.Role, r)));
            return new ClaimsPrincipal(identity);
        }
    }
}