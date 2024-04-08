<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
</head>

<style>
    body {
        font-family: DejaVu Sans, serif;
    }
</style>

<body>
<div class="container">
    <div class="col-md-8 section offset-md-2">
        <table class="table table-bordered">
            <thead>
            <tr>
                <td class="text-center" colspan="2"><b>Счёт за проживание для клиента</b><br>(создан: {{$data['createDate']}})</td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>ФИО клиента:</td>
                <td>
                    {{$data['registration']->client->person->surname}}
                    {{$data['registration']->client->person->name}}
                    {{$data['registration']->client->person->patronymic}}
                </td>
            </tr>

            <tr>
                <td>Паспорт:</td>
                <td>{{$data['registration']->client->passport}}</td>
            </tr>

            <tr>
                <td>Гостиничный номер:</td>
                <td>
                    &#x2116; {{$data['registration']->hotel_room->number}} | {{
                    $data['registration']->hotel_room->hotel_room_type->name}}
                </td>
            </tr>

            <tr>
                <td>Дара регистрации:</td>
                <td>{{$data['registration']->registration_date}}</td>
            </tr>

            <tr>
                <td>Длительность проживания:</td>
                <td>{{$data['registration']->duration}} (день)</td>
            </tr>

            <tr>
                <td>Стоимость за сутки:</td>
                <td>{{$data['registration']->hotel_room->hotel_room_type->price}} &#8381;</td>
            </tr>

            <tr>
                <td><b>Стоимость всего:</b></td>
                <td><b>{{$data['cost']}} &#8381;</b></td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
</body>
</html>
