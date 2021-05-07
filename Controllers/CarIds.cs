using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;
using System.Text;

namespace DatabaseManager.Controllers
{
    public class CarIds
    {
        // handles request for car ids
        public static bool updateCarIds(List<int> carIds)
        {
            string cmdStr = "SELECT samochod_id FROM SAMOCHOD";
            bool res = false;
            try
            {
                // opens SQL connection
                using (var conn = new SqlConnection(HomeController.connString))
                {
                    res = true;
                    conn.Open();

                    SqlCommand cmd = new SqlCommand(cmdStr, conn);

                    // executes command in reader manner
                    SqlDataReader dr = cmd.ExecuteReader();

                    if (dr.HasRows)
                    {
                        // reading with data reader until data available 
                        while (dr.Read())
                        {
                            var CarId = dr.GetInt32(0);
                            carIds.Add(CarId);
                        }
                    }
                    dr.Close();

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                // if any error ocurred res i set to false, that is returned
                res = false;
            }
            return res;
        }
    }
}
