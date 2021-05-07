using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;
using System.Text;

namespace DatabaseManager.Controllers
{
    public class Select
    {
        // updates Persons according to given command string
        public static bool updatePersons(string cmdStr)
        {
            bool res = false;
            try
            {
                // opens SQL connection
                using (var conn = new SqlConnection(HomeController.connString))
                {
                    res = true;
                    conn.Open();

                    // clears current persons
                    HomeController.persons.Clear();
                    SqlCommand cmd = new SqlCommand(cmdStr, conn);

                    // executes command in reader manner
                    SqlDataReader dr = cmd.ExecuteReader();

                    if (dr.HasRows)
                    {
                        // reading with data reader until data available 
                        while (dr.Read())
                        {
                            var PersonId = dr.GetInt32(0);
                            var Name = dr.GetString(1);
                            var Surname = dr.GetString(2);
                            var CarId = dr.GetInt32(3);
                            var Date = "";
                            if (!dr.IsDBNull(4)) Date = dr.GetDateTime(4).ToShortDateString();
                            var Capacity = (float)dr.GetDecimal(5);
                            var Cost = dr.GetSqlMoney(6).ToDouble();
                            // adding read person to persons
                            HomeController.persons.Add(
                                new Person
                                {
                                    PersonId = PersonId,
                                    Name = Name,
                                    Surname = Surname,
                                    CarId = CarId,
                                    Date = Date,
                                    Capacity = Capacity,
                                    Cost = Cost
                                });
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
