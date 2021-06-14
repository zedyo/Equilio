@extends('components.layout')

@section('header')
    <h1>Angestellter</h1>
@endsection

@section('content')
    <div>
        <div>
            <p>{{ $employee->id }}</p>
            <p>{{ $employee->first_name }} {{ $employee->last_name }}</p>
            <p>{{ $employee->qualification->description }}</p>
            <p>{{ $employee->diffForHumans }}</p>
            <button><a href="{{ route('employees.edit', ['employee' => $employee]) }}">EDIT</a></button>
            <button><a href="{{ route('employees.index') }}">BACK</a></button>
        </div>
    </div>
@endsection
