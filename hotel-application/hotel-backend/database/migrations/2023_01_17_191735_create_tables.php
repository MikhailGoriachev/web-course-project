<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {

        // персоны
        Schema::create('people', function (Blueprint $table) {
            $table->id();

            // фамилия
            $table->string('surname', 60);

            // имя
            $table->string('name', 40);

            // отчество
            $table->string('patronymic', 60);

            $table->timestamps();
            $table->softDeletes();
        });

        // клиенты
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            // персона
            $table->unsignedBigInteger('person_id');

            // паспорт
            $table->string('passport', 20)->unique();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('person_id')->on("people")->references('id');
        });

        // служащие гостиницы
        Schema::create('employees', function (Blueprint $table) {
            $table->id();

            // персона
            $table->unsignedBigInteger('person_id');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('person_id')->on('people')->references('id');
        });

        // типы номеров
        Schema::create('hotel_room_types', function (Blueprint $table) {
            $table->id();

            // название
            $table->string('name')->unique();

            // количество мест
            $table->integer('count_place');

            // стоимость в сутки
            $table->double('price');

            $table->timestamps();
            $table->softDeletes();
        });

        // этажи
        Schema::create('floors', function (Blueprint $table) {
            $table->id();

            // номер этажа
            $table->integer('number')->unique();

            $table->timestamps();
            $table->softDeletes();
        });

        // номера гостиницы
        Schema::create('hotel_rooms', function (Blueprint $table) {
            $table->id();

            // тип номера
            $table->unsignedBigInteger('hotel_room_type_id');

            // этаж
            $table->unsignedBigInteger('floor_id');

            // номер апартаментов (номера)
            $table->integer('number');

            // номер телефона
            $table->string('phone_number', 20)->unique();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('hotel_room_type_id')->on('hotel_room_types')->references('id');
            $table->foreign('floor_id')->on('floors')->references('id');
        });

        // города
        Schema::create('cities', function (Blueprint $table) {
            $table->id();

            // название
            $table->string('name', 80);

            $table->timestamps();
            $table->softDeletes();
        });

        // история поселений в гостиницу
        Schema::create('registration_hotel_histories', function (Blueprint $table) {
            $table->id();

            // клиент
            $table->unsignedBigInteger('client_id');

            // гостиничный номер
            $table->unsignedBigInteger('hotel_room_id');

            // город, из которого прибыл клиент
            $table->unsignedBigInteger('city_id');

            // дата поселения
            $table->date('registration_date');

            // длительность проживания (день)
            $table->integer('duration');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('client_id')->on('clients')->references('id');
            $table->foreign('hotel_room_id')->on('hotel_rooms')->references('id');
            $table->foreign('city_id')->on('cities')->references('id');
        });

        // дни недели
        Schema::create('week_days', function (Blueprint $table) {
            $table->id();

            // название дня недели
            $table->string('name', 30)->unique();

            // номер дня недели
            $table->integer('number')->unique();

            $table->timestamps();
            $table->softDeletes();
        });

        // график уборки
        Schema::create('schedule_cleanings', function (Blueprint $table) {
            $table->id();

            // день недели
            $table->unsignedBigInteger('week_day_id');

            // служащий гостиницы
            $table->unsignedBigInteger('employee_id');

            // этаж
            $table->unsignedBigInteger('floor_id');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('week_day_id')->on('week_days')->references('id');
            $table->foreign('employee_id')->on('employees')->references('id');
            $table->foreign('floor_id')->on('floors')->references('id');
        });

        // история фактов уборки
        Schema::create('cleaning_histories', function (Blueprint $table) {
            $table->id();

            // этаж
            $table->unsignedBigInteger('floor_id');

            // дата уборки
            $table->date('date_cleaning');

            // служащий гостиницы
            $table->unsignedBigInteger('employee_id');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('floor_id')->on('floors')->references('id');
            $table->foreign('employee_id')->on('employees')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('cleaning_histories');
        Schema::dropIfExists('schedule_cleanings');
        Schema::dropIfExists('week_days');
        Schema::dropIfExists('registration_hotel_histories');
        Schema::dropIfExists('cities');
        Schema::dropIfExists('hotel_rooms');
        Schema::dropIfExists('floors');
        Schema::dropIfExists('hotel_room_types');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('people');
    }
};
