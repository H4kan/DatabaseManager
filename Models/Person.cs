using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseManager.Models
{
    public class Person
    {
        public int PersonId { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public int CarId { get; set; }

        public string Date { get; set; }

        public float Capacity { get; set; }

        public double Cost { get; set; }
    }
}
