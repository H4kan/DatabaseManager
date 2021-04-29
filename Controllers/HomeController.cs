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
        private static string connString;

        static HomeController()
        {
            persons = new List<Person>();

            
            connString = string.Format("Server=.;Database={0};Trusted_Connection=True;", Info.DATABASE_NAME);


            updatePersons(selectStr);
        }


        public static bool updatePersons(string cmdStr)
        {
            bool res = false;
            try
            {
                using (var conn = new SqlConnection(connString))
                {
                    res = true;
                    conn.Open();

                    persons.Clear();
                    SqlCommand cmd = new SqlCommand(cmdStr, conn);

                    SqlDataReader dr = cmd.ExecuteReader();

                    if (dr.HasRows)
                    {
                        
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
                            persons.Add(
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
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                res = false;
            }
            return res;
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
            var empty = new List<Person>();
            if (updatePersons(query.ToString()) == false) return Json(empty);
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

            query.Append(" COMMIT TRANSACTION END TRY BEGIN CATCH ROLLBACK TRANSACTION END CATCH ");

            var empty = new List<Person>();
            if (updatePersons(query.ToString()) == false || updatePersons(lastSelect) == false) return Json(empty);
            
            return Json(persons);
        }

        [Route(Info.API_ENDPOINT)]
        [HttpPatch]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Patch([FromBody] EditInfo info)
        {
            StringBuilder query = new StringBuilder("BEGIN TRANSACTION BEGIN TRY UPDATE OSOBY SET ");

                
            query.Append(string.Format("imie='{0}', ", info.Name));
            query.Append(string.Format("nazwisko='{0}', ", info.Surname));
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

            query.Append(string.Format("WHERE osoba_id={0}", info.PersonId));


            query.Append(" END TRY BEGIN CATCH ROLLBACK TRANSACTION THROW END CATCH COMMIT TRANSACTION");

            var empty = new List<Person>();
            if (updatePersons(query.ToString()) == false || updatePersons(lastSelect) == false) return Json(empty);
            return Json(persons);
        }

        [Route(Info.API_ENDPOINT)]
        [HttpPut]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Put([FromBody] EditInfo info)
        {
            StringBuilder query = new StringBuilder("BEGIN TRANSACTION BEGIN TRY ");
            if (info.Date.Length > 0)
            {
                var date = Convert.ToDateTime(info.Date).Date;
                query.Append("INSERT INTO OSOBY (imie, nazwisko, samochod_id, data_prod) ");
                query.Append(string.Format("VALUES('{0}', '{1}', {2}, '{3}-{4}-{5}')", info.Name, info.Surname,
                    info.CarId, date.Year, date.Month, date.Day));
            }
            else
            {
                query.Append("INSERT INTO OSOBY (imie, nazwisko, samochod_id) ");
                query.Append(string.Format("VALUES('{0}', '{1}', {2})", info.Name, info.Surname,
                    info.CarId));
            }
            query.Append(" END TRY BEGIN CATCH ROLLBACK TRANSACTION THROW END CATCH COMMIT TRANSACTION");

            var empty = new List<Person>();
            if (updatePersons(query.ToString()) == false || updatePersons(lastSelect) == false) return Json(empty);
            return Json(persons);
        }

        [Route(Info.API_ENDPOINT)]
        [HttpOptions]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Post([FromBody] LoginInfo info)
        {
            
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
