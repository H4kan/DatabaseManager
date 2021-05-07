using DatabaseManager.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseManager.Controllers
{
    public class Filter
    {
        public static bool isFilterClear(FilterInfo info)
        {
            return !(info.Name != "" || info.Surname != "" || info.Cost[0] != "" || info.Cost[1] != "" ||
                info.Capacity[0] != "" || info.Capacity[1] != "" ||
                info.Date[0] != "" || info.Date[1] != "");
        }

        // handles request for filtering/sorting records
        public static bool filterPersons(FilterInfo info)
        {
            // firstly, last received persons are cleared
            HomeController.persons.Clear();

            // query is select with some special where conditions
            StringBuilder query = new StringBuilder(HomeController.selectStr + " ");
            if (!isFilterClear(info))
            {

                query.Append("WHERE ");

                // name and surname are parametrized to avoid sql injection
                if (info.Name != "") query.Append("imie LIKE @name AND ");
                if (info.Surname != "") query.Append("nazwisko LIKE @surname AND ");
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
            // setting sorting using ORDER BY clause
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

            bool res = false;
            try
            {
                using (var conn = new SqlConnection(HomeController.connString))
                {
                    res = true;
                    conn.Open();
                    var cmd = new SqlCommand(query.ToString(), conn);

                    // setting parametrized name and surname
                    if (info.Name != "") cmd.Parameters.Add("@name", System.Data.SqlDbType.VarChar).Value = "%" + info.Name + "%";
                    if (info.Surname != "") cmd.Parameters.Add("@surname", System.Data.SqlDbType.VarChar).Value = "%" + info.Surname + "%";


                    SqlDataReader dr = cmd.ExecuteReader();

                    // reading data till available, adding to persons
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
                // if any erro happen res is set to false and function returns false
                res = false;
            }
            if (res) HomeController.lastFilter = info;
            return res;
        }
    }
}
