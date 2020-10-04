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
    public static class UpdateMachine
    {
        [FunctionName("UpdateMachine")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var user = StaticWebAppsAuth.Parse(req);
            if(user != null && user.Identity.IsAuthenticated)
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                Machine m = JsonConvert.DeserializeObject<Machine>(requestBody);

                string container = user.Identity.Name;
                IFileClient fileClient = new AzureBlobFileClient(
                    Environment.GetEnvironmentVariable("StorageConnectionString"));
                using (MemoryStream stream = new MemoryStream(System.Text.Encoding.Default.GetBytes(m.Content)))
                {
                    await fileClient.SaveFile(container, m.Id + ".json", stream);
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
