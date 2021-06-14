@extends('components.layout')

@section('header')
    <h1>Angestellte</h1>
@endsection

@section('content')
    <div>
        <div>
            @foreach($employees as $employee)
                <div id="employee_{{ $employee->id }}">
                    <a href="{{ route('employees.show', ['employee' => $employee]) }}">ID: {{ $employee->id }}</a>
{{--                    @foreach($qualification->employees as $employee)--}}
                    <p>{{ $employee->first_name }} {{  $employee->last_name }}</p>
                    <p>Created: {{ $employee->diffForHumans }}</p>
{{--                    @endforeach--}}
                </div>
            @endforeach
        </div>
        <button><a href={{ route('employees.create') }}>CREATE</a></button>
    </div>
@endsection
