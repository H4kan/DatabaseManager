using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;
using System.Text;

namespace DatabaseManager.Controllers
{
    public class Edit
    {
        // handles Edit person request
        public static bool editPerson(EditInfo info)
        {
            // query  to execute edition, transaction handled
            StringBuilder query = new StringBuilder("BEGIN TRANSACTION BEGIN TRY UPDATE OSOBY SET ");

            // setting query fields using info instance
            // making name and surname parametrized to prevent sql injection
            query.Append(string.Format("imie=@name, ", info.Name));
            query.Append(string.Format("nazwisko=@surname, ", info.Surname));
            if (info.Date.Length > 0)
            {
                var date = Convert.ToDateTime(info.Date).Date;
                query.Append(string.Format("data_prod='{0}-{1}-{2}', ", date.Year, date.Month, date.Day));
            }
            else
            {
                query.Append(string.Format("data_prod=NULL, "));
            }
            query.Append(string.Format("samochod_id={0} ", info.CarId));
            // which record should be updated is chosen based on osoba_id
            query.Append(string.Format("WHERE osoba_id={0}", info.PersonId));
            query.Append(" END TRY BEGIN CATCH ROLLBACK TRANSACTION THROW END CATCH COMMIT TRANSACTION");

            bool res = false;
            try
            {
                using (var conn = new SqlConnection(HomeController.connString))
                {
                    res = true;
                    conn.Open();
                    var cmd = new SqlCommand(query.ToString(), conn);
                    
                    // setting query parameters
                    cmd.Parameters.Add("@name", System.Data.SqlDbType.VarChar).Value = info.Name;
                    cmd.Parameters.Add("@surname", System.Data.SqlDbType.VarChar).Value = info.Surname;
                    if (cmd.ExecuteNonQuery() < 1) { res = false; };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                res = false;
            }
            return res;

        }
    }
}
