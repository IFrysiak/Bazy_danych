from app import db

class Kary(db.Model):
    id_kary = db.Column(db.Integer, primary_key=True)
    id_wypozyczenia = db.Column(db.Integer, db.ForeignKey('wypozyczenia.id_wypozyczenia'), nullable=False)
    kwota = db.Column(db.Numeric, nullable=False)
    data_ostatniego_naliczenia = db.Column(db.String(11), nullable=False)
    oplacona = db.Column(db.Boolean, default=False)

    def to_json(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class Klienci(db.Model):
    id_klienta = db.Column(db.Integer, primary_key=True)
    id_uzytkownika = db.Column(db.Integer, db.ForeignKey('uzytkownik.id_uzytkownika'), nullable=False)
    telefon = db.Column(db.String(15), nullable=True)
    zaleglosci = db.Column(db.Numeric, nullable=True)
    
    def to_json(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class Uzytkownik(db.Model):
    id_uzytkownika = db.Column(db.Integer, primary_key=True)
    imie = db.Column(db.String(100), nullable=False)
    nazwisko = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    haslo = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class Pracownicy(db.Model):
    id_pracownika = db.Column(db.Integer, primary_key=True)
    id_uzytkownika = db.Column(db.Integer, db.ForeignKey('uzytkownik.id_uzytkownika'), nullable=False)
    rola = db.Column(db.String(50), nullable=False)
    
    def to_json(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class Ksiazki(db.Model):
    id_ksiazki = db.Column(db.Integer, primary_key=True)
    tytul = db.Column(db.String(200), nullable=False)
    autor = db.Column(db.String(200), nullable=False)
    rok_wydania = db.Column(db.Integer, nullable=False)
    kategoria = db.Column(db.String(50), nullable=False)
    id_pracownika = db.Column(db.Integer, db.ForeignKey('pracownicy.id_pracownika'), nullable=False)

    @property
    def liczba_egzemplarzy(self):
        return Egzemplarze.query.filter(Egzemplarze.id_ksiazki == self.id_ksiazki, Egzemplarze.stan.in_(["dostepna", "wypozyczona", "zarezerwowana"])).count()

    @property
    def dostepne_egzemplarze(self):
        return Egzemplarze.query.filter_by(id_ksiazki=self.id_ksiazki, stan="dostepna").count()

    def to_json(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class Egzemplarze(db.Model):
    id_egzemplarza = db.Column(db.Integer, primary_key=True)
    id_ksiazki = db.Column(db.Integer, db.ForeignKey('ksiazki.id_ksiazki'), nullable=False)
    stan = db.Column(db.Enum('dostepna', 'wypozyczona', 'zarezerwowana', 'zniszczona', name='stan_enum'), nullable=False)

    def to_json(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class Wypozyczenia(db.Model):
    id_wypozyczenia = db.Column(db.Integer, primary_key=True)
    id_klienta = db.Column(db.Integer, db.ForeignKey('klienci.id_klienta'), nullable=False)
    id_egzemplarza = db.Column(db.Integer, db.ForeignKey('egzemplarze.id_egzemplarza'), nullable=False)
    data_wypozyczenia = db.Column(db.String(11), nullable=False)
    termin_zwrotu = db.Column(db.String(11), nullable=False)
    data_faktycznego_zwrotu = db.Column(db.String(11), nullable=True)

    def to_json(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class Rezerwacje(db.Model):
    id_rezerwacji = db.Column(db.Integer, primary_key=True)
    id_klienta = db.Column(db.Integer, db.ForeignKey('klienci.id_klienta'), nullable=False)
    id_ksiazki = db.Column(db.Integer, db.ForeignKey('ksiazki.id_ksiazki'), nullable=False)
    data_rezerwacji = db.Column(db.String(11), nullable=False)
    termin_waznosci = db.Column(db.String(11), nullable=False)

    def to_json(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}
