using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;

namespace DatabaseManager.Controllers
{
    
    public class HomeController : Controller
    {

        private static string selectStr = "SELECT o.*, pojemnosc, cena FROM OSOBY o JOIN SAMOCHOD s ON s.samochod_id=o.samochod_id";
        private static readonly IList<Person> persons;

        static HomeController()
        {
            persons = new List<Person>();
            
            string connString = string.Format("Server=.;Database={0};Trusted_Connection=True;", Info.DATABASE_NAME);
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    SqlCommand cmd = new SqlCommand(selectStr, conn);
                    conn.Open();
                    

                    SqlDataReader dr = cmd.ExecuteReader();

                    if (dr.HasRows)
                    {
                        while (dr.Read())
                        {
                            
                            persons.Add(
                                new Person
                                {
                                    PersonId = dr.GetInt32(0),
                                    Name = dr.GetString(1),
                                    Surname = dr.GetString(2),
                                    CarId = dr.GetInt32(3),
                                    Date = dr.GetDateTime(4),
                                    Capacity = (float)dr.GetDecimal(5),
                                    Cost = dr.GetSqlMoney(6).ToDouble()
                                }) ;
                        }
                    }
                    dr.Close();
                }
            }
            catch (Exception ex)
            {
                //display error message
                Console.WriteLine(ex.Message);
            }
        }
        [Route(Info.API_ENDPOINT)]
        [HttpPost]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Filter([FromBody] FilterInfo info)
        {
            System.Diagnostics.Debug.WriteLine(info.ToString());
            return Json(info);
        }


        [Route(Info.API_ENDPOINT)]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Persons()
        {
            return Json(persons);
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
