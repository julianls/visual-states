using System;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace VisState.Storage
{
    public class AzureBlobFileClient : IFileClient
    {
        private CloudBlobClient _blobClient;

        public AzureBlobFileClient(string connectionString)
        {
            var account = CloudStorageAccount.Parse(connectionString);
            _blobClient = account.CreateCloudBlobClient();
        }

        public async Task DeleteFile(string storeName, string filePath)
        {
            var container = _blobClient.GetContainerReference(storeName);
            var blob = container.GetBlockBlobReference(filePath.ToLower());

            await blob.DeleteIfExistsAsync();
        }

        public async Task<bool> FileExists(string storeName, string filePath)
        {
            var container = _blobClient.GetContainerReference(storeName);
            var blob = container.GetBlockBlobReference(filePath.ToLower());

            return await blob.ExistsAsync();
        }

        public async Task<Stream> GetFile(string storeName, string filePath)
        {
            var container = _blobClient.GetContainerReference(storeName);
            var blob = container.GetBlockBlobReference(filePath.ToLower());

            var mem = new MemoryStream();
            await blob.DownloadToStreamAsync(mem);
            mem.Seek(0, SeekOrigin.Begin);

            return mem;
        }

        public async Task<List<Uri>> GetChildUris(string storeName)
        {
            var container = _blobClient.GetContainerReference(storeName);
            await container.CreateIfNotExistsAsync();
            List<Uri> urls = new List<Uri>();
            BlobContinuationToken blobContinuationToken = null;
            do
            {
                var resultSegment = await container.ListBlobsSegmentedAsync(
                    prefix            : null,
                    useFlatBlobListing: true, 
                    blobListingDetails: BlobListingDetails.None,
                    maxResults        : null,
                    currentToken      : blobContinuationToken,
                    options           : null,
                    operationContext  : null
                );

                // Get the value of the continuation token returned by the listing call.
                blobContinuationToken = resultSegment.ContinuationToken;
                foreach (IListBlobItem item in resultSegment.Results)
                {
                    urls.Add(item.Uri);
                }
            } while (blobContinuationToken != null); // Loop while the continuation token is not null.

            return urls;
        }

        public async Task<string> GetFileUrl(string storeName, string filePath)
        {
            var container = _blobClient.GetContainerReference(storeName);
            var blob = container.GetBlockBlobReference(filePath.ToLower());
            string url = null;

            if (await blob.ExistsAsync())
            {
                url = blob.Uri.AbsoluteUri;
            }

            return url;
        }

        public async Task SaveFile(string storeName, string filePath, Stream fileStream)
        {
            var container = _blobClient.GetContainerReference(storeName);
            await container.CreateIfNotExistsAsync();
            var blob = container.GetBlockBlobReference(filePath.ToLower());

            await blob.UploadFromStreamAsync(fileStream);
        }
    }
}
