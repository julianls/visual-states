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
    public static class GetMachine
    {
        [FunctionName("GetMachine")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var user = StaticWebAppsAuth.Parse(req);
            if(user != null && user.Identity.IsAuthenticated)
            {
                string id = req.Query["id"];
                Machine m = new Machine();
                m.Id = id;
                m.Name = "Machine" + id;
                
                string container = Utils.GetSafeContainerName(user.Identity.Name);
                IFileClient fileClient = Utils.GetFileClient();
                using(Stream stream = await fileClient.GetFile(container, id + ".json"))
                using(TextReader tr = new StreamReader(stream))
                {
                    m.Content = await tr.ReadToEndAsync();
                }
                
                return new OkObjectResult(JsonConvert.SerializeObject(m));
            }
            else
            {
                log.LogInformation("C# HTTP trigger function processed a request no logged in user.");
            }

            return new UnauthorizedResult();
        }
    }
}
