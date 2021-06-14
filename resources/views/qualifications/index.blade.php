@extends('components.layout')

@section('header')
    <h1>Qualifikationen</h1>
@endsection

@section('content')
    <div>
        <div>
            @foreach($qualifications as $qualification)
                <div id="qualification_{{ $qualification->id }}">
                    <a href="{{ route('qualifications.show', ['qualification' => $qualification]) }}">{{ $qualification->id }} {{ $qualification->description }}</a>
                    @foreach($qualification->employees as $employee)
                    <p>{{ $employee->first_name }} {{  $employee->last_name }}</p>
                    <p>{{ $employee->diffForHumans }}</p>
                    @endforeach
                </div>
            @endforeach
        </div>
        <button><a href={{ route('qualifications.create') }}>CREATE</a></button>
    </div>
@endsection
