using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseManager.Models
{
    public class FilterInfo
    {
        public string Action { get; set; }
        public string Name { get; set; }

        public string Surname { get; set; }

        public string[] Date { get; set; }

        public string[] Capacity { get; set; }
        public string[] Cost { get; set; }

        public string SortOrd { get; set; }

    }
}
