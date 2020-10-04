using System;
using VisState.Storage;

namespace VisState.Shared
{
    public static class Utils
    {
        public static string GetSafeContainerName(string name){
            name = name.Replace(".", "-");
            name = name.Replace("@", "-");
            name = name.Replace("_", "-");
            return name;
        }

        public static IFileClient GetFileClient()
        {
            return new AzureBlobFileClient(Environment.GetEnvironmentVariable("StorageConnectionString"));
        }
    }
}