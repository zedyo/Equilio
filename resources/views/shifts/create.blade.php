@extends('components.layout')

@section('header')
    <h1>Schicht anlegen</h1>
@endsection

@section('content')
    <div>
        <form action="{{ route('shifts.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <label for="abrv">Abkürzung
                    <input type="text" name="abrv">
                </label>
                <label for="color_hex">Farbe
                    <input type="text" name="color_hex" value="#000000">
                </label>
                <label for="h_duration">Dauer
                    <input type="text" name="h_duration" value="8.00">
                </label>
                <button type="submit">SAVE</button>
            </div>
        </form>
    </div>
@endsection
