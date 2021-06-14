@extends('components.layout')

@section('header')
    <h1>Schicht bearbeiten</h1>
@endsection

@section('content')
    <div>
        <p>{{ $shift->id }}</p>
        <form action="{{ route('shifts.update', ['shift' => $shift]) }}" method="post">
            @method('PUT')
            @csrf

            <div class="form-group">
                <label for="abrv">Abkürzung
                    <input type="text" name="abrv" value="{{ $shift->abrv }}">
                </label>
                <label for="color_hex">Farbe
                    <input type="text" name="color_hex" value="{{ $shift->color_hex }}">
                </label>
                <label for="h_duration">Dauer
                    <input type="text" name="h_duration" value="{{ $shift->h_duration }}">
                </label>
                <button type="submit">SAVE</button>
            </div>
        </form>
    </div>
@endsection
