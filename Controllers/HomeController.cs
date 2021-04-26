using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;
using System.Text;

namespace DatabaseManager.Controllers
{
    
    public class HomeController : Controller
    {

        private static string selectStr = "SELECT o.*, pojemnosc, cena FROM OSOBY o JOIN SAMOCHOD s ON s.samochod_id=o.samochod_id";
        private static string lastSelect = selectStr;
        private static readonly IList<Person> persons;
        private static SqlConnection conn;

        static HomeController()
        {
            persons = new List<Person>();

            
            string connString = string.Format("Server=.;Database={0};Trusted_Connection=True;", Info.DATABASE_NAME);
            try
            {
                conn = new SqlConnection(connString);
                conn.Open();

                updatePersons(selectStr);
                
            }
            catch (Exception ex)
            {
                //display error message
                Console.WriteLine(ex.Message);
            }
        }


        public static void updatePersons(string cmdStr)
        {
            persons.Clear();
            SqlCommand cmd = new SqlCommand(cmdStr, conn);

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
                        });
                }
            }
            dr.Close();
        }

        public bool isFilterClear(FilterInfo info)
        {
            return !(info.Name != "" || info.Surname != "" || info.Cost[0] != "" || info.Cost[1] != "" || 
                info.Capacity[0] != "" || info.Capacity[1] != "" ||
                info.Date[0] != "" || info.Date[1] != "");
        }

        [Route(Info.API_ENDPOINT)]
        [HttpPost]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Filter([FromBody] FilterInfo info)
        {
            StringBuilder query = new StringBuilder(selectStr + " ");
            if (!isFilterClear(info))
            {

                query.Append("WHERE ");

                if (info.Name != "") query.Append(string.Format("imie LIKE '%{0}%' AND ", info.Name));
                if (info.Surname != "") query.Append(string.Format("nazwisko LIKE '%{0}%' AND ", info.Surname));
                if (info.Cost[0] != "") query.Append(string.Format("cena >= {0} AND ", info.Cost[0]));
                if (info.Cost[1] != "") query.Append(string.Format("cena <= {0} AND ", info.Cost[1]));
                if (info.Capacity[0] != "") query.Append(string.Format("pojemnosc >= {0} AND ", info.Capacity[0]));
                if (info.Capacity[1] != "") query.Append(string.Format("pojemnosc <= {0} AND ", info.Capacity[1]));
                if (info.Date[0] != "")
                {
                    var date = Convert.ToDateTime(info.Date[0]);
                    query.Append(string.Format("data_prod >= '{0}.{1}.{2}' AND ", date.Month, date.Day, date.Year));
                }
                if (info.Date[1] != "")
                {
                    var date = Convert.ToDateTime(info.Date[1]);
                    query.Append(string.Format("data_prod <= '{0}.{1}.{2}' AND ", date.Month, date.Day, date.Year));
                }
                query.Remove(query.Length - 4, 4);

          
            }
            if (info.SortOrd != "")
            {
                query.Append("ORDER BY ");
                switch (info.SortOrd)
                {
                    case "name":
                        query.Append("imie");
                        break;
                    case "surname":
                        query.Append("nazwisko");
                        break;
                    case "dateDesc":
                        query.Append("data_prod DESC");
                        break;
                    case "dateAsc":
                        query.Append("data_prod ASC");
                        break;
                    case "capDesc":
                        query.Append("pojemnosc DESC");
                        break;
                    case "capAsc":
                        query.Append("pojemnosc ASC");
                        break;
                    case "costDesc":
                        query.Append("cena DESC");
                        break;
                    case "costAsc":
                        query.Append("cena ASC");
                        break;
                    default:
                        break;
                }
                
            }
            updatePersons(query.ToString());
            lastSelect = query.ToString();
            return Json(persons);
        }

        [Route(Info.API_ENDPOINT)]
        [HttpDelete]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Delete([FromBody] DeleteInfo info)
        {
            StringBuilder query = new StringBuilder("BEGIN TRANSACTION BEGIN TRY DELETE FROM OSOBY WHERE");

            foreach(var id in info.PersonId)
                query.Append(string.Format(" osoba_id={0} OR", id));

            query.Remove(query.Length - 2, 2);

            query.Append(" END TRY BEGIN CATCH ROLLBACK TRANSACTION END CATCH COMMIT TRANSACTION");

            updatePersons(query.ToString());
            updatePersons(lastSelect);
            return Json(persons);
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
