using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;
using System.Text;

namespace DatabaseManager.Controllers
{
    public class Login
    {
        // handles manager login request
        public static bool SaveLogin(LoginInfo info)
        {
            if (info.Trusted)
                HomeController.connString = string.Format("Server={0};Database={1};Trusted_Connection=True;", info.ServerName, info.DbName);
            else
                HomeController.connString = string.Format("Server={0};Database={1};User Id={2};Password={3};", info.ServerName, info.DbName, info.Login, info.Password);

            bool succ = false;
            // this query is used to check if given database is available
            var cmdStr = "select count(*) from master.dbo.sysdatabases where name = @database";
            try
            {
                using (var sqlConnection = new SqlConnection(HomeController.connString))
                {
                    using (var cmd = new SqlCommand(cmdStr, sqlConnection))
                    {
                        cmd.Parameters.Add("@database", System.Data.SqlDbType.NVarChar).Value = info.DbName;

                        sqlConnection.Open();

                        succ = Convert.ToInt32(cmd.ExecuteScalar()) == 1;
                    }
                }
            }
            catch
            {
                succ = false;
            }
            // if no error happened, persons updated by default select string
            return (succ && Select.updatePersons(HomeController.selectStr));
        }
    }
}
