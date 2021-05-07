using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;
using System.Text;

namespace DatabaseManager.Controllers
{
    public class Add
    {
        // adds new person based on information saved in info instance
        public static bool addPerson(EditInfo info)
        {
            // query holds insert command in transaction
            StringBuilder query = new StringBuilder("BEGIN TRANSACTION BEGIN TRY ");
            if (info.Date.Length > 0)
            {
                var date = Convert.ToDateTime(info.Date).Date;
                query.Append("INSERT INTO OSOBY (imie, nazwisko, samochod_id, data_prod) ");

                query.Append(string.Format("VALUES(@name, @surname, {0}, '{1}-{2}-{3}')", info.CarId, date.Year, date.Month, date.Day));
            }
            else
            {
                query.Append("INSERT INTO OSOBY (imie, nazwisko, samochod_id) ");
                // name and surname are parametrized to prevent sql injection
                query.Append(string.Format("VALUES(@name, @surname, {0})", info.CarId));
            }
            query.Append(" END TRY BEGIN CATCH ROLLBACK TRANSACTION THROW END CATCH COMMIT TRANSACTION");

            bool res = false;
            try
            {
                using (var conn = new SqlConnection(HomeController.connString))
                {
                    res = true;
                    conn.Open();
                    var cmd = new SqlCommand(query.ToString(), conn);
                    // setting parameters to adequate values
                    cmd.Parameters.Add("@name", System.Data.SqlDbType.VarChar).Value = info.Name;
                    cmd.Parameters.Add("@surname", System.Data.SqlDbType.VarChar).Value = info.Surname;
                    if (cmd.ExecuteNonQuery() < 1) { res = false; };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                // if any error occured, res set to false and returned later
                res = false;
            }

            return res;
        }
    }
}
