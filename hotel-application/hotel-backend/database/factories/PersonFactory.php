<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


class PersonFactory extends Factory {

    static array $people = [
        ["Сергеева", "Полина", "Артемьевна"],
        ["Миронов", "Василий", "Владиславович"],
        ["Новиков", "Егор", "Леонидович"],
        ["Прохорова", "Мария", "Дмитриевна"],
        ["Ефимова", "Софья", "Артёмовна"],
        ["Никитин", "Александр", "Александрович"],
        ["Семенов", "Павел", "Никитич"],
        ["Карпов", "Максим", "Иванович"],
        ["Воробьева", "Кристина", "Яновна"],
        ["Королева", "Вера", "Родионовна"],
        ["Денисова", "Ева", "Дмитриевна"],
        ["Алешина", "Милана", "Максимовна"],
        ["Громов", "Артём", "Артёмович"],
        ["Филатова", "Ева", "Максимовна"],
        ["Титов", "Илья", "Кириллович"],
        ["Фролов", "Константин", "Егорович"],
        ["Зубов", "Артём", "Даниилович"],
        ["Гришин", "Андрей", "Матвеевич"],
        ["Гришин", "Мирон", "Родионович"],
        ["Петрова", "Василиса", "Ильинична"],
        ["Соколов", "Семён", "Сергеевич"],
        ["Макаров", "Максим", "Ильич"],
        ["Соколов", "Михаил", "Матвеевич"],
        ["Волков", "Данила", "Артёмович"],
        ["Иванов", "Николай", "Никитич"],
        ["Савельева", "Адель", "Маратовна"],
        ["Данилова", "Валерия", "Львовна"],
        ["Сотникова", "Кира", "Владимировна"],
        ["Белоусова", "Анна", "Захаровна"],
        ["Зыков", "Семён", "Тимурович"],
        ["Климова", "Маргарита", "Владимировна"],
        ["Одинцов", "Илья", "Всеволодович"],
        ["Воронков", "Михаил", "Михайлович"],
        ["Алексеева", "Ксения", "Ярославовна"],
        ["Алексеева", "Полина", "Викторовна"],
        ["Леонова", "Софья", "Мироновна"],
        ["Фомин", "Василий", "Андреевич"],
        ["Власова", "Анна", "Алексеевна"],
        ["Завьялов", "Николай", "Никитич"],
        ["Кондратьева", "Аиша", "Семёновна"],
        ["Рябова", "Александра", "Дмитриевна"],
        ["Соколов", "Виктор", "Сергеевич"],
        ["Андреева", "Злата", "Игоревна"],
        ["Шаповалова", "Виктория", "Максимовна"],
        ["Васильев", "Вадим", "Дмитриевич"],
        ["Блохина", "Евгения", "Максимовна"],
        ["Кузнецова", "Полина", "Филипповна"],
        ["Алексеева", "Николь", "Романовна"],
        ["Широков", "Григорий", "Дмитриевич"],
        ["Кузнецова", "Варвара", "Александровна"],
        ["Жуков", "Ярослав", "Максимович"],
        ["Емельянова", "Арина", "Кирилловна"],
        ["Уварова", "Аделина", "Марковна"],
        ["Попова", "Анастасия", "Дмитриевна"],
        ["Королев", "Никита", "Романович"],
        ["Воронина", "Виктория", "Максимовна"],
        ["Рябова", "Дарья", "Львовна"],
        ["Королева", "Майя", "Максимовна"],
        ["Петрова", "Ева", "Фёдоровна"],
        ["Евсеева", "Амелия", "Сергеевна"],
        ["Шестаков", "Василий", "Николаевич"],
        ["Иванов", "Михаил", "Миронович"],
        ["Никитин", "Данила", "Максимович"],
        ["Коновалова", "Дарья", "Саввична"],
        ["Соколов", "Матвей", "Георгиевич"],
        ["Осипов", "Арсен", "Тимофеевич"],
        ["Макаров", "Иван", "Захарович"],
        ["Кузнецов", "Степан", "Артёмович"],
        ["Никитин", "Али", "Викторович"],
        ["Фролова", "Ульяна", "Викторовна"],
        ["Дубова", "Екатерина", "Никитична"],
        ["Громов", "Михаил", "Николаевич"],
        ["Иванов", "Даниил", "Романович"],
        ["Романов", "Илья", "Макарович"],
        ["Фролов", "Станислав", "Артёмович"],
        ["Моисеев", "Дмитрий", "Львович"],
        ["Столярова", "Алиса", "Андреевна"],
        ["Зорина", "Елена", "Данииловна"],
        ["Егорова", "Кристина", "Николаевна"],
        ["Ермолаев", "Артём", "Александрович"],
        ["Щербакова", "Камила", "Михайловна"],
        ["Савельева", "Екатерина", "Матвеевна"],
        ["Дубровин", "Александр", "Дмитриевич"],
        ["Зверева", "София", "Арсентьевна"],
        ["Смирнова", "Серафима", "Леонидовна"],
        ["Левин", "Елисей", "Павлович"],
        ["Беляева", "Варвара", "Максимовна"],
        ["Селезнева", "Мария", "Львовна"],
        ["Васильева", "Ева", "Алексеевна"],
        ["Нефедова", "Анна", "Максимовна"],
        ["Семенова", "Мария", "Ивановна"],
        ["Денисова", "Стефания", "Львовна"],
        ["Коровин", "Владимир", "Максимович"],
        ["Виноградова", "Кира", "Кирилловна"],
        ["Игнатова", "Марина", "Михайловна"],
        ["Толкачева", "Софья", "Ильинична"],
        ["Лобанов", "Демид", "Данилович"],
        ["Николаева", "Виктория", "Романовна"],
        ["Петров", "Даниил", "Артёмович"],
        ["Лапшин", "Алексей", "Артёмович"]
    ];

    public function definition(): array {

        $person = self::$people[(fake()->numberBetween(0, count(self::$people) - 1))];

        return [
            'surname' => $person[0],
            'name' => $person[1],
            'patronymic' => $person[2]
        ];
    }
}
