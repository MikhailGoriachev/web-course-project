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
<div class="mx-2">
    {{--    <div class="mx-5">--}}
    <table class="table table-bordered">
        <tbody>
        <tr>
            <td class="text-center" colspan="2"><b>Квартальный отчёт</b><br>(создан: {{$data['createDate']}})</td>
        </tr>

        <tr>
            <td>Начальная дата:</td>
            <td>
                {{$data['begin_date']}}
            </td>
        </tr>

        <tr>
            <td>Конечная дата:</td>
            <td>
                {{$data['end_date']}}
            </td>
        </tr>

        <tr>
            <td>Количество дней:</td>
            <td>
                {{$data['amountDays']}}
            </td>
        </tr>

        <tr>
            <td>Количество клиентов:</td>
            <td>
                {{$data['amountClients']}}
            </td>
        </tr>

        <tr>
            <td><b>Суммарная прибыль за проживание:</b></td>
            <td>
                <b>{{$data['account']}} &#8381;</b>
            </td>
        </tr>

        </tbody>
    </table>

    <table class="table table-bordered">
        <thead>
        <tr>
            <td class="text-center" colspan="6"><b>Информация о номерах</b> (всего: {{$data['roomsInfo']->count()}})
            </td>
        </tr>
        <tr>
            <th class="align-middle">Номер комнаты</th>
            <th class="align-middle">Этаж</th>
            <th class="align-middle">Тип номера</th>
            <th class="align-middle">Стоимость за сутки (&#8381;)</th>
            <th class="align-middle">Занято (день)</th>
            <th class="align-middle">Свободно (день)</th>
        </tr>
        </thead>
        <tbody>

        @foreach($data['roomsInfo']->all() as $item)
            <tr class="align-middle">
                <td>{{$item['room']->number}}</td>
                <td>{{$item['room']->floor->number}}</td>
                <td>{{$item['room']->hotel_room_type->name}}</td>
                <td>{{$item['room']->hotel_room_type->price}}</td>
                <td>{{$item['busyDays']}}</td>
                <td>{{$item['emptyDays']}}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    {{--    </div>--}}
</div>
</body>
</html>
