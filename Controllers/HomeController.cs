using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bd_lab1.Models;
using System.Data.SqlClient;

namespace bd_lab1.Controllers
{
    
    public class HomeController : Controller
    {
        private static readonly IList<Person> persons;

        static HomeController()
        {
            persons = new List<Person>();
            
            string connString = string.Format("Server=.;Database={0};Trusted_Connection=True;", Info.DATABASE_NAME);
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    SqlCommand cmd = new SqlCommand("SELECT * FROM OSOBY", conn);
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
                                    Date = dr.GetDateTime(4)
                                }) ;
                        }
                    }
                    dr.Close();
                }
            }
            catch (Exception ex)
            {
                //display error message
                persons[0].Name = ex.Message;
            }
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
