@extends('components.layout')

@section('header')
    <h1>Dienste</h1>
@endsection

@section('content')
    <div>
        <form action="{{ route('changeMonth', ['year' => $year, 'month' => $month]) }}" method="POST">
            @method('PATCH')
            @csrf

            <label>
                <input type="text" name="year" value="2000">
            </label>
            <label>
                <input type="text" name="month" value="12">
            </label>
            <button type="submit">Go</button>
        </form>

        <div style="display: grid; grid-auto-flow: column; grid-template-columns: 150px repeat( {{ count($days_of_month) }}, 40px ); grid-template-rows: 80px repeat( {{ count($employees) }}, 80px )">
           <p></p>
            @foreach($employees as $employee)
                <p> {{ $employee->first_name }} {{ $employee->last_name Wenn}}</p>
            @endforeach

            @foreach($days_of_month as $day_of_month)
                <p> {{ $day_of_month }} </p>
                @foreach($employees as $employee)
                    <label>
                        <input style="width: 35px" type="text">
                    </label>
                @endforeach

            @endforeach

        </div>


    </div>

@endsection
