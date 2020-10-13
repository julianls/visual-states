using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using VisState.Shared;
using VisState.Storage;

namespace VisState.Api
{
    public static class DeleteMachine
    {
        [FunctionName("DeleteMachine")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var user = StaticWebAppsAuth.Parse(req);
            if(user != null && user.Identity.IsAuthenticated)
            {
                string id = req.Query["id"];

                string container = Utils.GetSafeContainerName(user.Identity.Name);

                DataManager dm = Utils.GetDataManager();
                await dm.DeleteMachine(container, id);

                return new OkResult();
            }
            else
            {
                log.LogInformation("C# HTTP trigger function processed a request no logged in user.");
            }

            return new UnauthorizedResult();
        }
    }
}
