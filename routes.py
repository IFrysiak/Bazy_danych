from app import app, db
from flask import request, jsonify
from models import Kary, Klienci, Uzytkownik, Pracownicy, Ksiazki, Egzemplarze, Wypozyczenia, Rezerwacje
#from datetime import datetime
from sqlalchemy.sql import func

# funkcja pomocnicza do generowania wyniku JSON
def generate_response(items):
    return jsonify([item.to_json() for item in items])

# Uzytkownicy
@app.route("/api/uzytkownicy", methods=["GET"])
def get_uzytkownicy():
    uzytkownicy = Uzytkownik.query.all()
    return generate_response(uzytkownicy)

@app.route("/api/uzytkownicy", methods=["POST"])
def create_uzytkownik():
    data = request.json
    try:
        uzytkownik = Uzytkownik(
            imie=data['imie'],
            nazwisko=data['nazwisko'],
            email=data['email'],
            haslo=data['haslo']
        )
        db.session.add(uzytkownik)
        db.session.commit()
        return jsonify({"message": "Uzytkownik dodany pomyslnie"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/uzytkownicy/<int:id>", methods=["PATCH"])
def update_uzytkownik(id):
    data = request.json
    uzytkownik = Uzytkownik.query.get(id)
    if not uzytkownik:
        return jsonify({"error": "Uzytkownik nie znaleziony"}), 404
    try:
        uzytkownik.imie = data.get('imie', uzytkownik.imie)
        uzytkownik.nazwisko = data.get('nazwisko', uzytkownik.nazwisko)
        uzytkownik.email = data.get('email', uzytkownik.email)
        uzytkownik.haslo = data.get('haslo', uzytkownik.haslo)
        db.session.commit()
        return jsonify({"message": "Uzytkownik zaktualizowany"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/uzytkownicy/<int:id>", methods=["DELETE"])
def delete_uzytkownik(id):
    uzytkownik = Uzytkownik.query.get(id)
    if not uzytkownik:
        return jsonify({"error": "Uzytkownik nie znaleziony"}), 404
    db.session.delete(uzytkownik)
    db.session.commit()
    return jsonify({"message": "Uzytkownik usuniety"}), 200

# Klienci
@app.route("/api/klienci", methods=["GET"])
def get_klienci():
    klienci = Klienci.query.all()
    result = []
    for klient in klienci:
        zaleglosci = db.session.query(func.sum(Kary.kwota)).join(Wypozyczenia).filter(Wypozyczenia.id_klienta == klient.id_klienta, Kary.oplacona == False).scalar() or 0
        result.append({
            "id_klienta": klient.id_klienta,
            "id_uzytkownika": klient.id_uzytkownika,
            "telefon": klient.telefon,
            "zaleglosci": float(zaleglosci)
        })
    return jsonify(result)

@app.route("/api/klienci/<int:id>", methods=["GET"])
def get_klient(id):
    klient = Klienci.query.get(id)
    if not klient:
        return jsonify({"error": "Klient nie znaleziony"}), 404

    zaleglosci = db.session.query(func.sum(Kary.kwota)).join(Wypozyczenia).filter(Wypozyczenia.id_klienta == klient.id_klienta, Kary.oplacona == False).scalar() or 0

    result = {
        "id_klienta": klient.id_klienta,
        "id_uzytkownika": klient.id_uzytkownika,
        "telefon": klient.telefon,
        "zaleglosci": float(zaleglosci)
    }
    return jsonify(result)

@app.route("/api/klienci", methods=["POST"])
def create_klient():
    data = request.json
    try:
        if not Uzytkownik.query.get(data['id_uzytkownika']):
            return jsonify({"error": "Uzytkownik o podanym ID nie istnieje"}), 400
        
        klient = Klienci(
            id_uzytkownika=data['id_uzytkownika'],
            telefon=data.get('telefon'),
            zaleglosci=data.get('zaleglosci', 0)
        )
        db.session.add(klient)
        db.session.commit()
        return jsonify({"message": "Klient dodany pomyslnie"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/klienci/<int:id>", methods=["PATCH"])
def update_klient(id):
    data = request.json
    klient = Klienci.query.get(id)
    if not klient:
        return jsonify({"error": "Klient nie znaleziony"}), 404
    try:
        if 'id_uzytkownika' in data and not Uzytkownik.query.get(data['id_uzytkownika']):
            return jsonify({"error": "Uzytkownik o podanym ID nie istnieje"}), 400
        
        klient.id_uzytkownika = data.get('id_uzytkownika', klient.id_uzytkownika)
        klient.telefon = data.get('telefon', klient.telefon)
        klient.zaleglosci = data.get('zaleglosci', klient.zaleglosci)
        db.session.commit()
        return jsonify({"message": "Klient zaktualizowany"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/klienci/<int:id>", methods=["DELETE"])
def delete_klient(id):
    klient = Klienci.query.get(id)
    if not klient:
        return jsonify({"error": "Klient nie znaleziony"}), 404

    # sprawdzenie czy klient ma zaleglosci, gdy ma nie moze usunac konta
    zaleglosci = db.session.query(func.sum(Kary.kwota)).join(Wypozyczenia).filter(
        Wypozyczenia.id_klienta == klient.id_klienta, Kary.oplacona == False
    ).scalar() or 0

    if zaleglosci > 0:
        return jsonify({"error": "Nie można usunąć konta klienta z powodu zaległości."}), 400
    try:
        db.session.delete(klient)
        db.session.commit()
        return jsonify({"message": "Klient usunięty"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Pracownicy
@app.route("/api/pracownicy", methods=["GET"])
def get_pracownicy():
    pracownicy = Pracownicy.query.all()
    return generate_response(pracownicy)

@app.route("/api/pracownicy", methods=["POST"])
def create_pracownik():
    data = request.json
    try:
        if not Uzytkownik.query.get(data['id_uzytkownika']):
            return jsonify({"error": "Uzytkownik o podanym ID nie istnieje"}), 400
        
        pracownik = Pracownicy(
            id_uzytkownika=data['id_uzytkownika'],
            rola=data['rola']
        )
        db.session.add(pracownik)
        db.session.commit()
        return jsonify({"message": "Pracownik dodany pomyslnie"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/pracownicy/<int:id>", methods=["PATCH"])
def update_pracownik(id):
    data = request.json
    pracownik = Pracownicy.query.get(id)
    if not pracownik:
        return jsonify({"error": "Pracownik nie znaleziony"}), 404
    try:
        if 'id_uzytkownika' in data and not Uzytkownik.query.get(data['id_uzytkownika']):
            return jsonify({"error": "Uzytkownik o podanym ID nie istnieje"}), 400
        
        pracownik.id_uzytkownika = data.get('id_uzytkownika', pracownik.id_uzytkownika)
        pracownik.rola = data.get('rola', pracownik.rola)
        db.session.commit()
        return jsonify({"message": "Pracownik zaktualizowany"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/pracownicy/<int:id>", methods=["DELETE"])
def delete_pracownik(id):
    pracownik = Pracownicy.query.get(id)
    if not pracownik:
        return jsonify({"error": "Pracownik nie znaleziony"}), 404
    db.session.delete(pracownik)
    db.session.commit()
    return jsonify({"message": "Pracownik usuniety"}), 200

# Ksiazki
@app.route("/api/ksiazki", methods=["GET"])
def get_ksiazki():
    ksiazki = Ksiazki.query.all()
    result = []
    for ksiazka in ksiazki:
        result.append({
            "id_ksiazki": ksiazka.id_ksiazki,
            "tytul": ksiazka.tytul,
            "autor": ksiazka.autor,
            "rok_wydania": ksiazka.rok_wydania,
            "kategoria": ksiazka.kategoria,
            "liczba_egzemplarzy": ksiazka.liczba_egzemplarzy,
            "dostepne_egzemplarze": ksiazka.dostepne_egzemplarze,
            "id_pracownika": ksiazka.id_pracownika,
        })
    return jsonify(result)

@app.route("/api/ksiazki/<int:id_ksiazki>", methods=["GET"])
def get_ksiazka(id_ksiazki):
    ksiazka = Ksiazki.query.get(id_ksiazki)
    if not ksiazka:
        return jsonify({"error": "Ksiazka nie znaleziona"}), 404

    result = {
        "id_ksiazki": ksiazka.id_ksiazki,
        "tytul": ksiazka.tytul,
        "autor": ksiazka.autor,
        "rok_wydania": ksiazka.rok_wydania,
        "kategoria": ksiazka.kategoria,
        "liczba_egzemplarzy": ksiazka.liczba_egzemplarzy,
        "dostepne_egzemplarze": ksiazka.dostepne_egzemplarze,
    }
    return jsonify(result)

@app.route("/api/ksiazki", methods=["POST"])
def add_ksiazka():
    data = request.json
    try:
        # sprawdzenie czy pracownik istnieje
        pracownik = Pracownicy.query.get(data['id_pracownika'])
        if not pracownik:
            return jsonify({"error": "Pracownik o podanym ID nie istnieje"}), 400

        ksiazka = Ksiazki(
            tytul=data['tytul'],
            autor=data['autor'],
            rok_wydania=data['rok_wydania'],
            kategoria=data['kategoria'],
            id_pracownika=data['id_pracownika']
            #liczba_egzemplarzy (dynamicznie) = stan: "dostepna" + "wypozyczona" + "zarezerwowana"
            #dostepne_egzemplarze (dynamicznie) = stan: "dostepna"
        )
        db.session.add(ksiazka)
        db.session.commit()
        return jsonify(ksiazka.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/ksiazki/<int:id>", methods=["PATCH"])
def update_ksiazka(id):
    data = request.json
    ksiazka = Ksiazki.query.get(id)
    if not ksiazka:
        return jsonify({"error": "Ksiazka nie znaleziona"}), 404
    try:
        ksiazka.tytul = data.get('tytul', ksiazka.tytul)
        ksiazka.autor = data.get('autor', ksiazka.autor)
        ksiazka.rok_wydania = data.get('rok_wydania', ksiazka.rok_wydania)
        ksiazka.kategoria = data.get('kategoria', ksiazka.kategoria)
        #ksiazka.liczba_egzemplarzy = data.get('liczba_egzemplarzy', ksiazka.liczba_egzemplarzy)
        #ksiazka.dostepne_egzemplarze = data.get('dostepne_egzemplarze', ksiazka.dostepne_egzemplarze)
        #ksiazka.id_pracownika = data.get('id_pracownika', ksiazka.id_pracownika)
        db.session.commit()
        return jsonify(ksiazka.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/ksiazki/<int:id>", methods=["DELETE"])
def delete_ksiazka(id):
    ksiazka = Ksiazki.query.get(id)
    if not ksiazka:
        return jsonify({"error": "Ksiazka nie znaleziona"}), 404
    db.session.delete(ksiazka)
    db.session.commit()
    return jsonify({"message": "Ksiazka usunieta"}), 200

# Egzemplarze
@app.route("/api/egzemplarze", methods=["GET"])
def get_egzemplarze():
    egzemplarze = Egzemplarze.query.all()
    return generate_response(egzemplarze)

@app.route("/api/ksiazki/<int:id_ksiazki>/egzemplarze", methods=["GET"])
def get_egzemplarze_ksiazki(id_ksiazki):
    egzemplarze = Egzemplarze.query.filter_by(id_ksiazki=id_ksiazki).all()
    return generate_response(egzemplarze)

@app.route("/api/egzemplarze", methods=["POST"])
def create_egzemplarz():
    data = request.json
    try:
        if not Ksiazki.query.get(data['id_ksiazki']):
            return jsonify({"error": "Ksiazka o podanym ID nie istnieje"}), 400
        egzemplarz = Egzemplarze(
            id_ksiazki=data['id_ksiazki'],
            stan=data['stan']
        )
        db.session.add(egzemplarz)
        db.session.commit()
        return jsonify({"message": "Egzemplarz dodany pomyslnie"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/egzemplarze/<int:id>", methods=["PATCH"])
def update_egzemplarz(id):
    data = request.json
    egzemplarz = Egzemplarze.query.get(id)
    if not egzemplarz:
        return jsonify({"error": "Egzemplarz nie znaleziony"}), 404
    try:
        egzemplarz.stan = data.get('stan', egzemplarz.stan)
        db.session.commit()
        return jsonify({"message": "Egzemplarz zaktualizowany"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/egzemplarze/<int:id>", methods=["DELETE"])
def delete_egzemplarz(id):
    egzemplarz = Egzemplarze.query.get(id)
    if not egzemplarz:
        return jsonify({"error": "Egzemplarz nie znaleziony"}), 404
    try:
        db.session.delete(egzemplarz)
        db.session.commit()
        return jsonify({"message": "Egzemplarz usuniety"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Wypożyczenia
@app.route("/api/wypozyczenia", methods=["GET"])
def get_wypozyczenia():
    wypozyczenia = Wypozyczenia.query.all()
    return generate_response(wypozyczenia)

@app.route("/api/wypozyczenia", methods=["POST"])
def create_wypozyczenie():
    data = request.json
    try:
        klient = Klienci.query.get(data['id_klienta'])
        if not klient:
            return jsonify({"error": "Klient o podanym ID nie istnieje"}), 400
        
        egzemplarz = Egzemplarze.query.get(data['id_egzemplarza'])
        if not egzemplarz or egzemplarz.stan != "dostepna":
            return jsonify({"error": "Egzemplarz jest niedostępny lub nie istnieje"}), 400

        data_wypozyczenia = data['data_wypozyczenia']
        termin_zwrotu = data['termin_zwrotu']
        # konwersja daty z JSON na obiekt datetime.date
        #data_wypozyczenia = datetime.strptime(data['data_wypozyczenia'], "%Y-%m-%d").date()
        #termin_zwrotu = datetime.strptime(data['termin_zwrotu'], "%Y-%m-%d").date()

        wypozyczenie = Wypozyczenia(
            id_klienta=data['id_klienta'],
            id_egzemplarza=data['id_egzemplarza'],
            data_wypozyczenia=data_wypozyczenia,
            termin_zwrotu=termin_zwrotu
        )
        egzemplarz.stan = "wypozyczona"
        db.session.add(wypozyczenie)
        db.session.commit()
        return jsonify({"message": "Wypożyczenie dodane pomyślnie"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/wypozyczenia/<int:id>", methods=["PATCH"])
def update_wypozyczenie(id):
    data = request.json
    wypozyczenie = Wypozyczenia.query.get(id)
    if not wypozyczenie:
        return jsonify({"error": "Wypożyczenie nie znalezione"}), 404
    try:
        if "data_faktycznego_zwrotu" in data:
            wypozyczenie.data_faktycznego_zwrotu = data['data_faktycznego_zwrotu']
            #wypozyczenie.data_faktycznego_zwrotu = datetime.strptime(data['data_faktycznego_zwrotu'], "%Y-%m-%d").date()
            # przywrócenie egzemplarza na stan "dostepna" w przypadku zwrotu
            egzemplarz = Egzemplarze.query.get(wypozyczenie.id_egzemplarza)
            if egzemplarz:
                egzemplarz.stan = "dostepna"

        if "termin_zwrotu" in data:
            wypozyczenie.termin_zwrotu = data['termin_zwrotu']
            #wypozyczenie.termin_zwrotu = datetime.strptime(data['termin_zwrotu'], "%Y-%m-%d").date()

        if "data_wypozyczenia" in data:
            wypozyczenie.data_wypozyczenia = data['data_wypozyczenia']
            #wypozyczenie.data_wypozyczenia = datetime.strptime(data['data_wypozyczenia'], "%Y-%m-%d").date()

        db.session.commit()
        return jsonify({"message": "Wypożyczenie zaktualizowane"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/wypozyczenia/<int:id>", methods=["DELETE"])
def delete_wypozyczenie(id):
    wypozyczenie = Wypozyczenia.query.get(id)
    if not wypozyczenie:
        return jsonify({"error": "Wypożyczenie nie znalezione"}), 404
    try:
        # przywracanie dostępności egzemplarza po usunięciu wypożyczenia
        egzemplarz = Egzemplarze.query.get(wypozyczenie.id_egzemplarza)
        if egzemplarz:
            egzemplarz.stan = "dostepna"

        db.session.delete(wypozyczenie)
        db.session.commit()
        return jsonify({"message": "Wypożyczenie usunięte"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Rezerwacje
@app.route("/api/rezerwacje", methods=["GET"])
def get_rezerwacje():
    rezerwacje = Rezerwacje.query.all()
    result = []
    for rezerwacja in rezerwacje:
        result.append({
            "id_rezerwacji": rezerwacja.id_rezerwacji,
            "id_klienta": rezerwacja.id_klienta,
            "id_ksiazki": rezerwacja.id_ksiazki,
            "data_rezerwacji": rezerwacja.data_rezerwacji,
            "termin_waznosci": rezerwacja.termin_waznosci
        })
    return jsonify(result)

@app.route("/api/rezerwacje", methods=["POST"])
def create_rezerwacja():
    data = request.json
    try:
        klient = Klienci.query.get(data['id_klienta'])
        if not klient:
            return jsonify({"error": "Klient o podanym ID nie istnieje"}), 400

        ksiazka = Ksiazki.query.get(data['id_ksiazki'])
        if not ksiazka:
            return jsonify({"error": "Książka o podanym ID nie istnieje"}), 400

        # sprawdzenie czy istnieje dostępny egzemplarz do rezerwacji
        egzemplarz = Egzemplarze.query.filter_by(id_ksiazki=data['id_ksiazki'], stan="dostepna").first()
        if not egzemplarz:
            return jsonify({"error": "No books available to reserve."}), 400

        data_rezerwacji = data['data_rezerwacji']
        termin_waznosci = data['termin_waznosci']
        #data_rezerwacji = datetime.strptime(data['data_rezerwacji'], "%Y-%m-%d").date()
        #termin_waznosci = datetime.strptime(data['termin_waznosci'], "%Y-%m-%d").date()

        rezerwacja = Rezerwacje(
            id_klienta=data['id_klienta'],
            id_ksiazki=data['id_ksiazki'],
            data_rezerwacji=data_rezerwacji,
            termin_waznosci=termin_waznosci
        )

        egzemplarz.stan = "zarezerwowana"

        db.session.add(rezerwacja)
        db.session.commit()
        return jsonify({"message": "Rezerwacja dodana pomyślnie, egzemplarz został zarezerwowany"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/rezerwacje/<int:id>", methods=["PATCH"])
def update_rezerwacja(id):
    data = request.json
    rezerwacja = Rezerwacje.query.get(id)
    if not rezerwacja:
        return jsonify({"error": "Rezerwacja nie znaleziona"}), 404
    try:
        if "data_rezerwacji" in data:
            rezerwacja.data_rezerwacji = data['data_rezerwacji']
            #rezerwacja.data_rezerwacji = datetime.strptime(data['data_rezerwacji'], "%Y-%m-%d").date()
        if "termin_waznosci" in data:
            rezerwacja.termin_waznosci = data['termin_waznosci']
            #rezerwacja.termin_waznosci = datetime.strptime(data['termin_waznosci'], "%Y-%m-%d").date()

        db.session.commit()
        return jsonify({"message": "Rezerwacja zaktualizowana"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/rezerwacje/<int:id>", methods=["DELETE"])
def delete_rezerwacja(id):
    rezerwacja = Rezerwacje.query.get(id)
    if not rezerwacja:
        return jsonify({"error": "Rezerwacja nie znaleziona"}), 404
    try:
        # przywracanie dostępności egzemplarza po usunięciu wypożyczenia
        egzemplarz = Egzemplarze.query.filter_by(id_ksiazki=rezerwacja.id_ksiazki, stan="zarezerwowana").first()
        if egzemplarz:
            egzemplarz.stan = "dostepna"

        db.session.delete(rezerwacja)
        db.session.commit()
        return jsonify({"message": "Rezerwacja usunięta"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Kary
@app.route("/api/kary", methods=["GET"])
def get_kary():
    kary = Kary.query.all()
    return generate_response(kary)

@app.route("/api/kary", methods=["POST"])
def create_kara():
    data = request.json
    try:
        wypozyczenie = Wypozyczenia.query.get(data['id_wypozyczenia'])
        if not wypozyczenie:
            return jsonify({"error": "Wypożyczenie o podanym ID nie istnieje"}), 400

        kara = Kary(
            id_wypozyczenia=data['id_wypozyczenia'],
            kwota=data['kwota'],
            data_ostatniego_naliczenia=data['data_ostatniego_naliczenia'],
            #data_ostatniego_naliczenia=datetime.strptime(data['data_ostatniego_naliczenia'], "%Y-%m-%d").date(),
            oplacona=data.get('oplacona', False)
        )
        db.session.add(kara)
        db.session.commit()
        return jsonify({"message": "Kara dodana pomyślnie"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/kary/<int:id>", methods=["PATCH"])
def update_kara(id):
    data = request.json
    kara = Kary.query.get(id)
    if not kara:
        return jsonify({"error": "Kara nie znaleziona"}), 404
    try:
        if "kwota" in data:
            kara.kwota = data['kwota']
        if "data_ostatniego_naliczenia" in data:
            kara.data_ostatniego_naliczenia = data['data_ostatniego_naliczenia']
            #kara.data_ostatniego_naliczenia = datetime.strptime(data['data_ostatniego_naliczenia'], "%Y-%m-%d").date()
        if "oplacona" in data:
            kara.oplacona = data['oplacona'] # gdy kara zostanie oplacona, nie jest zliczana do zalegosci

        db.session.commit()
        return jsonify({"message": "Kara zaktualizowana"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route("/api/kary/<int:id>", methods=["DELETE"])
def delete_kara(id):
    kara = Kary.query.get(id)
    if not kara:
        return jsonify({"error": "Kara nie znaleziona"}), 404
    try:
        db.session.delete(kara)
        db.session.commit()
        return jsonify({"message": "Kara usunięta"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
