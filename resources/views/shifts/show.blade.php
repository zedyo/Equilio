@extends('components.layout')

@section('header')
    <h1>Schicht</h1>
@endsection

@section('content')
    <div>
        <div>
            <p>ID: {{ $shift->id }}</p>
            <p>Abkürzung: {{ $shift->abrv }}</p>
            <p>Dauer: {{ $shift->h_duration }} Stunden</p>
            <p style="color: {{ $shift->color_hex }}">Farbe: {{ $shift->color_hex }}</p>
            <button><a href="{{ route('shifts.edit', ['shift' => $shift]) }}">EDIT</a></button>
            <button><a href="{{ route('shifts.index') }}">BACK</a></button>
        </div>
    </div>
@endsection
