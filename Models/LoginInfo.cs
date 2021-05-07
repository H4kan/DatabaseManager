using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseManager.Models
{
    public class LoginInfo
    {
        public string ServerName { get; set; }

        public string DbName { get; set; }

        public bool Trusted { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }
    }
}
