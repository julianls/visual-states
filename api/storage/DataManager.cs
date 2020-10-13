using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using VisState.Shared;
using Microsoft.Azure.Cosmos.Table;

namespace VisState.Storage
{
    public class DataManager
    {
        private string storageConnectionString;

        public DataManager(string storageConnectionString)
        {
            this.storageConnectionString = storageConnectionString;
        }

        public async Task<CloudTable> CreateTableAsync(string tableName)
        {
            // Retrieve storage account information from connection string.
            CloudStorageAccount storageAccount = CreateStorageAccountFromConnectionString(storageConnectionString);

            // Create a table client for interacting with the table service
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());

            Console.WriteLine("Create a Table for the demo");

            // Create a table client for interacting with the table service 
            CloudTable table = tableClient.GetTableReference(tableName);
            if (await table.CreateIfNotExistsAsync())
            {
                Console.WriteLine("Created Table named: {0}", tableName);
            }
            else
            {
                Console.WriteLine("Table {0} already exists", tableName);
            }

            Console.WriteLine();
            return table;
        }

        public static CloudStorageAccount CreateStorageAccountFromConnectionString(string storageConnectionString)
        {
            // Parse the connection string and return a reference to the storage account.
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

            return storageAccount;
        }

        public static async Task<DynamicTableEntity> InsertOrMergeEntityAsync(CloudTable table, DynamicTableEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            try
            {
                // Create the InsertOrReplace table operation
                TableOperation insertOrMergeOperation = TableOperation.InsertOrMerge(entity);

                // Execute the operation.
                TableResult result = await table.ExecuteAsync(insertOrMergeOperation);
                DynamicTableEntity tableEntity = result.Result as DynamicTableEntity;

                if (result.RequestCharge.HasValue)
                {
                    Console.WriteLine("Request Charge of InsertOrMerge Operation: " + result.RequestCharge);
                }

                return tableEntity;
            }
            catch (StorageException e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }

        public static async Task<DynamicTableEntity> RetrieveEntityUsingPointQueryAsync(CloudTable table, string partitionKey, string rowKey)
        {
            try
            {
                TableOperation retrieveOperation = TableOperation.Retrieve<DynamicTableEntity>(partitionKey, rowKey);
                TableResult result = await table.ExecuteAsync(retrieveOperation);
                DynamicTableEntity tableEntity = result.Result as DynamicTableEntity;

                if (result.RequestCharge.HasValue)
                {
                    Console.WriteLine("Request Charge of Retrieve Operation: " + result.RequestCharge);
                }

                return tableEntity;
            }
            catch (StorageException e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }      

        public static IEnumerable<DynamicTableEntity> RetrieveEntitiesUsingPartitionQuery(CloudTable table, string partitionKey)
        {
            try
            {
                string filter = TableQuery.GenerateFilterCondition(
                        "PartitionKey", QueryComparisons.Equal, partitionKey);
                TableQuery<DynamicTableEntity> query =
                        new TableQuery<DynamicTableEntity>().Where(filter);

                var tableEntities =  table.ExecuteQuery(query);
                return tableEntities;
             }
            catch (StorageException e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }      

        public static async Task DeleteEntityAsync(CloudTable table, DynamicTableEntity deleteEntity)
        {
            try
            {
                if (deleteEntity == null)
                {
                    throw new ArgumentNullException("deleteEntity");
                }

                TableOperation deleteOperation = TableOperation.Delete(deleteEntity);
                TableResult result = await table.ExecuteAsync(deleteOperation);

                if (result.RequestCharge.HasValue)
                {
                    Console.WriteLine("Request Charge of Delete Operation: " + result.RequestCharge);
                }

            }
            catch (StorageException e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }

        public async Task<Machine> InsertOrUpdateMachine(Machine machine)
        {
            DynamicTableEntity entity = new DynamicTableEntity(machine.Owner, machine.Id);
            entity.Properties.Add("Name", EntityProperty.GeneratePropertyForString(machine.Name));
            entity.Properties.Add("Description", EntityProperty.GeneratePropertyForString(machine.Description));
            entity.Properties.Add("Path", EntityProperty.GeneratePropertyForString(machine.Path));
            entity.Properties.Add("Content", EntityProperty.GeneratePropertyForString(machine.Content));

            var tbl = await CreateTableAsync("machines");

            await InsertOrMergeEntityAsync(tbl, entity);

            return machine;
        }

        public async Task<Machine> GetMachine(string owner, string id)
        {
            var tbl = await CreateTableAsync("machines");
            var entity = await RetrieveEntityUsingPointQueryAsync(tbl, owner, id);

            Machine machine = new Machine();
            machine.Id = entity.RowKey;
            machine.Owner = entity.PartitionKey;
            machine.Name = entity.Properties["Name"].StringValue;
            machine.Description = entity.Properties["Description"].StringValue;
            machine.Path = entity.Properties["Path"].StringValue;
            machine.Content = entity.Properties["Content"].StringValue;

            return machine;
        }

        public async Task<IEnumerable<Machine>> GetMachines(string owner)
        {
            var tbl = await CreateTableAsync("machines");
            var entities = RetrieveEntitiesUsingPartitionQuery(tbl, owner);

            List<Machine> machines = new List<Machine>();

            foreach(var entity in entities){
                Machine machine = new Machine();
                machine.Id = entity.RowKey;
                machine.Owner = entity.PartitionKey;
                machine.Name = entity.Properties["Name"].StringValue;
                machine.Description = entity.Properties["Description"].StringValue;
                machine.Path = entity.Properties["Path"].StringValue;
                machine.Content = entity.Properties["Content"].StringValue;

                machines.Add(machine);
            } 

            return machines;
        }

        public async Task DeleteMachine(string owner, string id)
        {
            var tbl = await CreateTableAsync("machines");
            DynamicTableEntity entity = new DynamicTableEntity(owner, id) { ETag = "*" };
            await DeleteEntityAsync(tbl, entity);
        }
    }
}