using System;
using System.Collections.Generic;
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
    public static class GetMachines
    {
        [FunctionName("GetMachines")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            List<Machine> machines = new List<Machine>();

            var user = StaticWebAppsAuth.Parse(req);
            if(user != null && user.Identity.IsAuthenticated)
            {
                string container = Utils.GetSafeContainerName(user.Identity.Name);
                IFileClient fileClient = Utils.GetFileClient();

                foreach(Uri uri in await fileClient.GetChildUris(container))
                {
                    Machine m = new Machine();
                    m.Id = uri.Segments[uri.Segments.Length - 1].ToString().Replace(".json", "");
                    m.Name = "Machine" + m.Id;
                    machines.Add(m);
                }
            }
            else
            {
                log.LogInformation("C# HTTP trigger function processed a request no logged in user.");
            }

            string responseMessage = JsonConvert.SerializeObject(machines); 
            return new OkObjectResult(responseMessage);
        }
    }
}
