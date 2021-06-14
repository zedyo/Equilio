@extends('components.layout')

@section('header')
    <h1>Schichten</h1>
@endsection

@section('content')
    <div>
        <div>
            @foreach($shifts as $shift)
                <div id="shift_{{ $shift->id }}">
                    <a href="{{ route('shifts.show', ['shift' => $shift]) }}">ID: {{ $shift->id }}</a>
                    <p style="color: {{ $shift->color_hex }}">{{ $shift->abrv }}</p>
                    <p>Dauer: {{ $shift->h_duration }} Stunden </p>
                </div>
            @endforeach
        </div>
        <button><a href={{ route('shifts.create') }}>CREATE</a></button>
    </div>
@endsection
