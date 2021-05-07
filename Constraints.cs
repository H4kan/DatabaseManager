

    public static class Constraints
    {
        public const string DATABASE_NAME = "homework1_bd";

        public const string API_ENDPOINT = "persons";

        public const string SELECT_STR = "SELECT o.*, pojemnosc, cena FROM OSOBY o JOIN SAMOCHOD s ON s.samochod_id=o.samochod_id";
}
