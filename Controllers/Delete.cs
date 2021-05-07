using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseManager.Models;
using System.Data.SqlClient;
using System.Text;

namespace DatabaseManager.Controllers
{
    public class Delete
    {
        public static bool DeletePerson(DeleteInfo info)
        {
            // query holds string for sql delete command, transaction handled
            StringBuilder query = new StringBuilder("BEGIN TRANSACTION BEGIN TRY DELETE FROM OSOBY WHERE");

            // records are chosend based on osoba_id which values are stored in info instance
            foreach (var id in info.PersonId)
                query.Append(string.Format(" osoba_id={0} OR", id));

            // removing last "OR"
            query.Remove(query.Length - 2, 2);

            query.Append(" COMMIT TRANSACTION END TRY BEGIN CATCH ROLLBACK TRANSACTION END CATCH ");


            return Select.updatePersons(query.ToString());
        }
    }
}
