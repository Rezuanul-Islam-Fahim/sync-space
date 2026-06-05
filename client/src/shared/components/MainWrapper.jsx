const MainWrapper = ({ children }) => {
    return (
        <div className="min-h-screen bg-main-bg flex flex-col justify-center items-center text-text p-6">
            {children}
        </div>
    )
}

export default MainWrapper