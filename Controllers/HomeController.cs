using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;
using System.Text;
using DatabaseManager.Controllers;

namespace DatabaseManager.Controllers
{
    // controller of whole application
    public class HomeController : Controller
    {
        // holds default query for database to retrieve persons with cars
        public static string selectStr = Constraints.SELECT_STR;

        // holds last applied data filter
        public static FilterInfo lastFilter = null;
        // holds last retrieved persons list
        public static readonly IList<Person> persons;
        // holds sql connection string, is created during logging in
        public static string connString;

        static HomeController()
        {
            persons = new List<Person>();

        }

        // handles Filter/Sort Request
        [Route(Constraints.API_ENDPOINT)]
        [HttpPost]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult FilterRequest([FromBody] FilterInfo info)
        {
            var empty = new List<Person>();
            if (Filter.filterPersons(info) == false) return Json(empty);
            return Json(persons);
        }

        // handles Delete Request
        [Route(Constraints.API_ENDPOINT)]
        [HttpDelete]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult DeleteRequest([FromBody] DeleteInfo info)
        {
            var empty = new List<Person>();
            if (Delete.DeletePerson(info) == false) return Json(empty);
            if (lastFilter != null && Filter.filterPersons(lastFilter) == false) return Json(empty);
            else if (Select.updatePersons(selectStr) == false) return Json(empty);
            return Json(persons);
        }

        // handles Edit Request and getting carIds
        [Route(Constraints.API_ENDPOINT)]
        [HttpPatch]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Patch([FromBody] EditInfo info)
        {
            if (info.CarRequest)
            {
                List<int> carIds = new List<int>();
                CarIds.updateCarIds(carIds);
                return Json(carIds);
            }

            var empty = new List<Person>();
            if (Edit.editPerson(info) == false) return Json(empty);
            if (lastFilter != null && Filter.filterPersons(lastFilter) == false) return Json(empty);
            else if (Select.updatePersons(selectStr) == false) return Json(empty);
            return Json(persons);
        }

        // handles Add Request
        [Route(Constraints.API_ENDPOINT)]
        [HttpPut]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Put([FromBody] EditInfo info)
        {
            var empty = new List<Person>();
            if (Add.addPerson(info) == false) return Json(empty);
            if (lastFilter != null && Filter.filterPersons(lastFilter) == false) return Json(empty);
            else if (Select.updatePersons(selectStr) == false) return Json(empty);
            return Json(persons);
        }

        // handles Login Request
        [Route(Constraints.API_ENDPOINT)]
        [HttpOptions]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult LoginRequest([FromBody] LoginInfo info)
        {
            string SUCC = "SUCC";
            string FAIL = "FAIL";
            if (Login.SaveLogin(info) == false) return Json(FAIL);
            else return Json(SUCC);
        }


        // handles initial Get Request
        [Route(Constraints.API_ENDPOINT)]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Persons()
        {
            Select.updatePersons(selectStr);
         
            return Json(persons);
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
